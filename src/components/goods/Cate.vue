<template>
  <div class="">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 商品分类数据表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        show-index
        index-text="#"
        :selection-type="false"
        :expand-type="false"
        border
        class="tree-table"
      >
        <!-- 是否有效的列模板样式 -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag type="primary" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="danger" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="success" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:opt="">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="clearAddCateForm"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- option表示级联选择器绑定的数据 -->
          <!-- props表示具体的配置选项 -->
          <el-cascader
            v-model="selectedPraentCate"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      // 分类列表
      cateList: [],
      // 查询参数
      queryInfo: {
        // 3表示获取前三级所有的分类
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 记录总数
      total: 0,
      // 表格各列的配置
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          width: "400px",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          // width: "400px",
          // 表明当前列使用的是模板
          type: "template",
          // 当前列使用的模板名称
          template: "isok",
        },
        {
          label: "排序",
          prop: "cat_level",
          // width: "400px",
          // 表明当前列使用的是模板
          type: "template",
          // 当前列使用的模板名称
          template: "order",
        },
        {
          label: "操作",
          // prop: "cat_deleted",
          // width: "400px",
          // 表明当前列使用的是模板
          type: "template",
          // 当前列使用的模板名称
          template: "opt",
        },
      ],
      // 是否显示添加分类的对话框
      addCateDialogVisible: false,
      // 添加分类的表单
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      // 添加表单的验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级商品分类数据
      parentCateList: [],
      // 级联选择器的配置选项
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },
      // 选中的父级商品分类
      selectedPraentCate: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类的数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取商品分类数据失败");
      }
      console.log(res.data);
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    // 更新每页显示的记录条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 当前显示的页码数
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.pagenum = newCurrentPage;
      this.getCateList();
    },
    // 显示添加分类的对话框
    showAddCateDialog() {
      this.getParentCate();
      this.addCateDialogVisible = true;
    },
    //添加分类时获取所有父级的商品分类数据
    async getParentCate() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取父级商品分类数据失败");
      }
      // console.log(res.data);
      this.parentCateList = res.data;
    },
    // 级联选择器选择某一项时触发
    parentCateChange() {
      // console.log(this.selectedPraentCate);
      if (this.selectedPraentCate.length > 0) {
        this.addCateForm.cat_pid = this.selectedPraentCate[
          this.selectedPraentCate.length - 1
        ];
        this.addCateForm.cat_level = this.selectedPraentCate.length;
      } else {
        this.addCateForm.cat_pid = 0;
      }
    },
    // 确认添加分类
    addCate() {
      // console.log(this.addCateForm);
      this.$refs.addCateRef.validate(async (validate) => {
        if (!validate) {
          return;
        }
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        console.log(res);
        if (res.meta.status != 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    // 关闭对话框，清空数据
    clearAddCateForm() {
      this.$refs.addCateRef.resetFields();
      this.selectedPraentCate = [];
      // 需单独清空表单中的cat_pid和cat_level，因为这两个属性并不是由input绑定的，无法通过表单的清空函数来清空
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;

      console.log(this.addCateForm);
    },
  },
};
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
