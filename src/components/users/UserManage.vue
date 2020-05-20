<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary">添加用户</el-button>
          </el-col>
        </el-row>

        <el-table :data="userList" style="width: 100%" border stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column prop="username" label="姓名"> </el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column prop="mobile" label="电话"> </el-table-column>
          <el-table-column prop="role_name" label="角色"> </el-table-column>
          <el-table-column label="状态">
            <!-- 作用域插槽 -->
            <template v-slot:="scope">
              <el-switch v-model="scope.row.mg_state"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="180">
            <template v-slot:="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      paramsBody: {
        query: "",
        pagenum: "1",
        pagesize: "5",
      },
      userList: [],
      total: 0,
    };
  },
  created() {
    this.getUserData();
  },
  methods: {
    async getUserData() {
      let { data: res } = await this.$http.get("/users", {
        params: this.paramsBody,
      });
      if (res.meta.status != 200)
        return this.$message.error("获取用户列表信息");
      this.userList = res.data.users;
      this.total = res.data.total;
      console.log(res);
    },
  },
};
</script>
<style lang="less" scoped></style>
