<template>
  <div class="">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 提示框 -->
      <el-alert
        title="注意：只能为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>

      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectedCate"
            :options="cateList"
            :props="cateProps"
            @change="cateChanged"
          ></el-cascader>
        </el-col>

        <!-- 标签页显示动态参数和静态属性 -->
      </el-row>
      <el-row>
        <el-col>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="many">
              <el-button
                type="primary"
                :disabled="isBtnDisable"
                @click="addDialogVisible = true"
                >添加参数</el-button
              >

              <!-- 动态参数的表格 -->
              <el-table :data="manyTableData" border stripe>
                <!-- 参数可选项下拉列表 -->
                <el-table-column type="expand">
                  <template v-slot:="scope">
                    <!-- 循环渲染tag标签 -->
                    <el-tag
                      v-for="(item, index) in scope.row.attr_vals"
                      :key="index"
                      closable
                      @close="deleteAttr(scope.row, index)"
                      >{{ item }}</el-tag
                    >
                    <!-- 添加可选项的输入文本框 -->
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <!-- 添加按钮 -->
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                      >+ New Tag</el-button
                    >
                  </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column
                  prop="attr_name"
                  label="参数名称"
                ></el-table-column>
                <el-table-column label="操作">
                  <template v-slot:="scope">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="showEditDialog(scope.row.attr_id)"
                      >编辑</el-button
                    >
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deleteAttr(scope.row.attr_id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
              <el-button
                type="primary"
                :disabled="isBtnDisable"
                @click="addDialogVisible = true"
                >添加属性</el-button
              >

              <!-- 静态属性的表格 -->
              <el-table :data="onlyTableData" border stripe>
                <el-table-column type="expand">
                  <template v-slot:="scope">
                    <!-- 循环渲染tag标签 -->
                    <el-tag
                      v-for="(item, index) in scope.row.attr_vals"
                      :key="index"
                      closable
                      @close="deleteAttr(scope.row, index)"
                      >{{ item }}</el-tag
                    >
                    <!-- 添加可选项的输入文本框 -->
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <!-- 添加按钮 -->
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                      >+ New Tag</el-button
                    >
                  </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column
                  prop="attr_name"
                  label="属性名称"
                ></el-table-column>
                <el-table-column label="操作">
                  <template v-slot:="scope">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="showEditDialog(scope.row.attr_id)"
                      >编辑</el-button
                    >
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deleteAttr(scope.row.attr_id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加参数和属性共用的对话框 -->

    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="clearAddForm"
    >
      <!-- 添加参数或属性的表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->

    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="clearEditForm"
    >
      <!-- 添加参数或属性的表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      // 商品分类的数据
      cateList: [],
      //   级联选择器的使用规则
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选择的商品
      selectedCate: [],
      // 激活的标签页
      activeName: "many",
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数或属性的表单
      addForm: {
        attr_name: "",
      },
      // 添加参数或属性的验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // 修改参数的对话框显示或隐藏
      editDialogVisible: false,
      // 修改参数的表单
      editForm: {
        attr_name: "",
      },
      // 修改参数的验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //   获取商品分类的数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status != 200) {
        this.$message.error("商品分类数据获取失败");
      }
      //   console.log(res.data);
      this.cateList = res.data;
    },
    // 选择某一类商品
    cateChanged() {
      this.getCateParams();
    },
    //点击标签页
    handleClick() {
      // console.log(this.activeName);
      this.getCateParams();
    },
    // 获取商品的动态参数和静态属性
    async getCateParams() {
      //   限制选中的必须为第三级的项目，如果选中的不是第三级，则不会发送数据请求
      if (this.selectedCate.length !== 3) {
        this.selectedCate = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }

      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status != 200) {
        this.$message.error("获取商品参数失败");
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        // 设置每一个参数中可选项的输入框为不可见，设置输入的值为空
        item.inputVisible = false;
        item.inputValue = "";
      });

      console.log(res.data);
      if (this.activeName === "many") {
        this.manyTableData = res.data;
        // console.log(this.manyTableData);
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 关闭对话框时清空表格
    clearAddForm() {
      // console.log(3333333333);
      this.$refs.addFormRef.resetFields();
    },
    // 添加参数
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status != 201) {
          return this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功");
        this.addDialogVisible = false;
        this.getCateParams();
      });
    },
    // 显示编辑参数的对话框
    async showEditDialog(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status != 200) {
        this.$message.error("获取参数信息失败");
      }
      // this.paramsInfo=res.data;
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 关闭对话框时清空表格
    clearEditForm() {
      this.$refs.editFormRef.resetFields();
    },
    // 确认修改参数
    async editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        // console.log(this.activeName);
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        // console.log(res);
        if (res.meta.status != 200) {
          return this.$message.error("修改参数失败");
        }
        this.$message.success("修改参数成功");
        this.getCateParams();
        this.editDialogVisible = false;
      });
    },
    //删除参数
    async deleteAttr(attr_id) {
      const confirmReault = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmReault !== "confirm") {
        return this.$message.info("已取消删除操作");
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status != 200) {
        this.$message.error("参数删除失败");
      }
      this.$message.success("参数删除成功");
      this.getCateParams();
    },
    // 当鼠标移出或键入enter时调用
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }

      // 输入不为空则发送请求添加参数可选项
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttr(row);
    },
    // 显示输入框
    showInput(row) {
      row.inputVisible = true;
      // this.$nextTick的目的是为了使页面先渲染再执行nextTick内部的代码，
      //因为此处是先显示输入框，再对立即对输入框进行对焦
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 保存参数的设置到数据库
    async saveAttr(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(","),
        }
      );
      if (res.meta.status != 200) {
        return this.$message.error("修改参数失败");
      }
      this.$message.success("修改参数成功");
    },
    // 删除参数的值
    deleteAttr(row, i) {
      row.attr_vals.splice(i, 1);
      this.saveAttr(row);
    },
  },
  computed: {
    // 根据是否选中第三级的项目来决定按钮是否可以点击
    isBtnDisable() {
      if (this.selectedCate.length !== 3) {
        return true;
      } else {
        return false;
      }
    },
    // 所选中的分类商品的Id
    cateId() {
      if (this.selectedCate.length === 3) {
        return this.selectedCate[2];
      } else {
        return null;
      }
    },
    // 动态设置添加对话框的标题
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-cascader {
  margin-left: 10px;
  width: 250px;
}
.input-new-tag {
  width: 120px;
}
</style>
