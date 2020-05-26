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
            <el-input
              placeholder="请输入内容"
              v-model="paramsBody.query"
              clearable
              @clear="getUserData"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserData"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="addUserVisible = true"
              >添加用户</el-button
            >
          </el-col>
        </el-row>

        <!-- 用户信息表 -->
        <el-table :data="userList" style="width: 100%" border stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column prop="username" label="姓名"> </el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column prop="mobile" label="电话"> </el-table-column>
          <el-table-column prop="role_name" label="角色"> </el-table-column>
          <el-table-column label="状态">
            <!-- 作用域插槽 -->
            <template v-slot:="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="changeUserStatus(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="180">
            <template v-slot:="scope">
              <!-- 编辑用户按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditUser(scope.row.id)"
              ></el-button>
              <!-- 删除用户按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(scope.row.id)"
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
        <!-- 分页栏 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="paramsBody.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="paramsBody.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>

      <!-- 添加用户弹出的对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="addUserVisible"
        width="50%"
        @close="clearAddUserForm"
      >
        <el-form
          :model="addUserForm"
          :rules="addUserRules"
          ref="addUserRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户信息的对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editUserVisible"
        width="50%"
        @close="closeEditUser"
      >
        <el-form
          ref="editUserRef"
          :model="editUserForm"
          :rules="editUserRule"
          label-width="80px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editUserForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editUserVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    //自定义的邮箱和手机验证规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的验证码"));
    };
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      paramsBody: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      userList: [],
      total: 0,
      // 添加用户的对话框是否可见
      addUserVisible: false,
      // 添加用户表单
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户表单的验证规则
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 18,
            message: "长度在 3 到 18 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
      // 修改用户对话框可见性
      editUserVisible: false,
      // 修改用户表单
      editUserForm: {},
      // 修改用户的验证规则
      editUserRule: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getUserData();
  },
  methods: {
    // 获取用户数据
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
    //页记录数改变时触发
    handleSizeChange(pageSize) {
      this.paramsBody.pagesize = pageSize;
      this.getUserData();
    },
    //当前页码改变时触发
    handleCurrentChange(currentPage) {
      this.paramsBody.pagenum = currentPage;
      this.getUserData();
    },
    //改变用户状态
    async changeUserStatus(newUserInfo) {
      console.log(newUserInfo);
      const { data: res } = await this.$http.put(
        `users/${newUserInfo.id}/state/${newUserInfo.mg_state}`
      );
      if (res.meta.status != 200)
        return this.$message.error("用户状态更新失败");
      this.$message.success("用户状态更新成功");
      // console.log(res);
    },
    // 重置表单
    clearAddUserForm() {
      this.$refs.addUserRef.resetFields();
    },
    // 点击确认按钮，添加新用户
    addUser() {
      // 预验证
      this.$refs.addUserRef.validate(async (validate) => {
        if (!validate) return;
        const { data: res } = await this.$http.post("users", this.addUserForm);
        if (res.meta.status != 200) {
          this.$notify.error({
            title: "添加用户失败",
            duration: 1200,
          });
        }
        this.$notify.success({
          title: "用户添加成功",
          duration: 1200,
        });
        this.getUserData();
        this.addUserVisible = false;
      });
    },
    // 显示修改用户的对话框
    async showEditUser(id) {
      this.editUserVisible = true;
      const { data: res } = await this.$http.get("users/" + id);
      // console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("获取用户数据失败");
      }
      this.editUserForm = res.data;
    },
    // 重置修改用户的对话框
    closeEditUser() {
      this.$refs.editUserRef.resetFields();
      this.editUserVisible = false;
    },
    //确认修改用户信息
    editUserInfo() {
      // 预验证
      this.$refs.editUserRef.validate(async (validate) => {
        // console.log(validate);
        if (!validate) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editUserForm.id,
          {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile,
          }
        );
        if (res.meta.status != 200) {
          return this.$message.error("修改失败");
        }

        this.editUserVisible = false;
        this.getUserData();
        this.$message.success("用户信息修改成功");
      });
    },
    // 删除用户
    async deleteUser(id) {
      const isConfirm = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 判断是否取消删除
      if (isConfirm == "cancel") {
        return this.$message({ message: "取消删除成功", duration: 1000 });
      }
      if (isConfirm == "confirm") {
        const { data: res } = await this.$http.delete("users/" + id);
        console.log(res);
        if (res.meta.status != 200) {
          return this.$message.error("删除失败");
        }
        this.$message.success({
          message: "删除成功",
          duration: 1000,
        });
        this.getUserData();
      }
    },
  },
};
</script>
<style lang="less" scoped></style>
