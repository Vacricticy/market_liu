<template>
  <div class="">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="6">
          <!-- 搜索 -->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="120px"
        ></el-table-column>
        <el-table-column label="是否付款" width="120px">
          <template v-slot:="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="120px"
        ></el-table-column>
        <el-table-column label="下单时间" prop="" width="170px">
          <template v-slot:="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot:="scope">
            <!-- 修改地址 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editAddressDialogVisible = true"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location-outline"
              size="mini"
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

    <!-- 修改地址的对话框 -->

    <el-dialog
      title="修改地址"
      :visible.sync="editAddressDialogVisible"
      width="50%"
      @close="clearAddressForm"
    >
      <!-- 修改地址的表单 -->

      <el-form
        :model="addressForm"
        :rules="addressRules"
        ref="addressRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区/县" prop="roughAddress">
          <el-cascader
            v-model="addressForm.selectedAddress"
            :options="cityData"
            :props="addressProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="addressForm.detailAddress"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata.js";
export default {
  name: "",
  data() {
    return {
      // 订单查询参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      orderList: [],
      //   地区数据
      cityData,
      //   控制修改地址的对话框显示或隐藏
      editAddressDialogVisible: false,
      //   修改地址的表单
      addressForm: {
        selectedAddress: [],
        detailAddress: "",
      },
      //   级联选择器的使用规则
      addressProps: {
        expandTrigger: "hover",
        children: "children",
      },
      //   修改地址的表单的验证规则
      addressRules: {
        roughAddress: [
          { required: true, message: "请选择省市区/县", trigger: "blur" },
        ],
        detailAddress: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    //   获取订单数据
    async getOrderList() {
      console.log(this.queryInfo);
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取订单数据失败");
      }
      //   console.log(res.data);
      this.total = res.data.total;
      this.orderList = res.data.goods;
      console.log(this.orderList);
    },
    // 改变每一页的记录数
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.queryInfo.pagenum = 1;
      this.getOrderList();
    },
    // 改变当前的页码数
    handleCurrentChange(currentnum) {
      this.queryInfo.pagenum = currentnum;
      this.getOrderList();
    },
    // 在地址级联选择器中选择一个地址
    handleChange() {
      console.log(this.addressForm.selectedAddress);
    },
    //   清空修改地址的表单
    clearAddressForm() {
      this.addressForm.selectedAddress = [];
      this.$refs.addressRef.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
