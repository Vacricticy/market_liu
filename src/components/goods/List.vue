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
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="clearQuery"
            @keyup.enter.native="
              handleCurrentChange(1);
              getGoodsList;
            "
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="
                handleCurrentChange(1);
                getGoodsList;
              "
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品数据表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="110px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="110px"
        ></el-table-column>
        <el-table-column label="创建时间" width="170px">
          <template v-slot:="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
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
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
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
    // 改变每页显示的记录条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 改变当前页码
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getGoodsList();
    },
    // 清空搜索框
    clearQuery() {
      this.queryInfo.query = "";
      this.getGoodsList();
    },
    // 删除商品
    async deleteGoods(goods_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        this.$message.info("已取消删除该商品");
      }
      const { data: res } = await this.$http.delete(`goods/${goods_id}`);
      if (res.meta.status != 200) {
        return this.$message.error("商品删除失败");
      }
      this.$message.success("已成功删除该商品");
      this.getGoodsList();
    },
    // 跳转到添加商品页面
    goAddPage(){
      this.$router.push('/goods/add')
    }
  },
};
</script>

<style lang="less" scoped></style>
