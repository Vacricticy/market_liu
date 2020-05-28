<template>
  <div class="">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" ></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px"></el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot:="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      // 商品列表
      goodsList: [],
      //查询商品列表的参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      //   总记录数
      total: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //   获取商品列表的数据
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) {
        this.$message.error("获取商品列表数据失败");
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      //   console.log(res.data);
    },
  },
};
</script>

<style lang="less" scoped></style>
