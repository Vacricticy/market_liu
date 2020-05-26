<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe >
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot:="scope">
            <el-tag type="success" v-if="scope.row.level == 0"
              >等级{{ scope.row.level }}</el-tag
            >
            <el-tag type="info" v-else-if="scope.row.level == 1"
              >等级{{ scope.row.level }}</el-tag
            >
            <el-tag type="warning" v-else>等级{{ scope.row.level }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightsList: [],
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      if (res.meta.status != 200) {
        return this.$message.error("获取权限列表失败");
      }
      this.rightsList = res.data;
      console.log(this.rightsList);
    },
  },
};
</script>
<style lang="less" scoped></style>
