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
