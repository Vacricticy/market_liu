<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-button type="primary">添加角色</el-button>
      </el-row>
      <!-- 角色与权限列表 -->
      <el-table :data="rolesList" style="width:100%" border stripe>
        <!-- 下拉列表详情 -->
        <el-table-column type="expand">
          <template v-slot:="scope">
            <el-row
              v-for="(first, index) in scope.row.children"
              :key="index"
              :class="[
                'border-bottom',
                index === 0 ? 'border-top' : '',
                'vcenter',
              ]"
            >
              <!-- 一级权限的渲染 -->
              <el-col :span="6">
                <el-tag closable @close="deleteRight(scope.row, first.id)">{{
                  first.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限的渲染 -->
              <el-col :span="18">
                <el-row
                  v-for="(second, index) in first.children"
                  :key="index"
                  :class="[index === 0 ? '' : 'border-top', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteRight(scope.row, second.id)"
                      >{{ second.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限的渲染 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="(third, index) in second.children"
                      :key="index"
                      type="warning"
                      closable
                      @close="deleteRight(scope.row, third.id)"
                      >{{ third.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>  {{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="">
          <template v-slot:="scope">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限的对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="clearDefTree"
      >
        <!-- 树形控件 -->
        <el-tree
          :data="rightsList"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          ref="rightTreeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRight">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      //   显示分配权限的对话框
      setRightDialogVisible: false,
      //   所有的权限列表
      rightsList: [],
      //   树形控件子属性设置规则
      defaultProps: {
        children: "children",
        label: "authName",
      },
      //   树形控件默认选中的数组
      defKeys: [],
      roleId: "",
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //   获取权限列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      console.log(res.data);
      if (res.meta.status != 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolesList = res.data;
    },
    // 删除角色的权限
    async deleteRight(role, rightId) {
      const isConfirm = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (isConfirm != "confirm") {
        this.$message.info("已取消删除权限");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status != 200) {
        this.$message.error("角色权限删除失败");
      }
      role.children = res.data;
    },
    // 显示分配权限的对话框
    async showSetRightDialog(node) {
      //   this.defKeys = [];
      this.roleId = node.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status != 200) {
        this.$message.error("获取权限列表失败");
      }
      this.rightsList = res.data;
      //   console.log(this.rightsList);
      this.getTreeDefKeys(node, this.defKeys);
      console.log(this.defKeys);
      this.setRightDialogVisible = true;
    },
    // 递归获取树形控件中的默认值
    getTreeDefKeys(node, keys) {
      if (!node.children) {
        return keys.push(node.id);
      }
      node.children.forEach((item) => this.getTreeDefKeys(item, keys));
    },
    // 关闭分配权限的对话框时清空数据
    clearDefTree() {
      this.defKeys = [];
    },
    // 分配权限
    async setRight() {
      const keys = [
        ...this.$refs.rightTreeRef.getHalfCheckedKeys(),
        ...this.$refs.rightTreeRef.getCheckedKeys(),
      ];
      //   console.log(keys);
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: keys.join(",") }
      );
      if (res.meta.status != 200) {
        return this.$message.error("修改权限失败");
      }
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
  },
};
</script>
<style lang="less">
.el-tag {
  margin: 6px;
}
.border-top {
  border-top: 1px solid #eee;
}
.border-bottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
