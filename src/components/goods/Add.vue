<template>
  <div class="">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 所有的数据都包裹在一个表单中 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRef"
        label-position="top"
        class="demo-ruleForm"
      >
        <!-- tabs标签页 -->
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeLeaveTabs"
          @tab-click="tabClicked"
        >
          <!-- 标签1：商品基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 标签2：商品动态参数 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in manyData"
              :key="index"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <!-- 复选框组 -->
                <el-checkbox
                  :label="oneAttrVal"
                  v-for="(oneAttrVal, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 标签3：商品静态属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in onlyTableData"
              :key="index"
            >
              <el-input v-model="item.attr_vals[0]"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 标签4：上传商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div> -->
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce" />
            <el-button type="primary" class="btnAdd" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览的对话框 -->

    <el-dialog
      title="图片详情"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      // 激活的步骤条索引和标签页索引，前者为数值型，后者为字符串型
      activeIndex: "0",
      //   添加商品的表单
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //   选中的商品分类
        goods_cat: [],
        // 上传的图片数组列表
        pics: [],
        // 富文本编辑器的内容
        goods_introduce: "",
        //   商品的参数
        attrs: [],
      },
      // 添加商品的验证规则
      addRules: {
        goods_name: {
          required: true,
          message: "请输入商品名称",
          trigger: "blur",
        },
        goods_price: {
          required: true,
          message: "请输入商品价格",
          trigger: "blur",
        },
        goods_weight: {
          required: true,
          message: "请输入商品重量",
          trigger: "blur",
        },
        goods_number: {
          required: true,
          message: "请输入商品数量",
          trigger: "blur",
        },
        goods_cat: {
          required: true,
          message: "请选中商品分类",
          trigger: "blur",
        },
      },
      //   商品分类列表
      cateList: [],
      // 级联器设置规则
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //   商品动态参数
      manyData: [],
      //   商品静态属性
      onlyTableData: [],
      //   上传地址的url
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      // 上传头像的header
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //   图片预览路径
      previewPath: "",
      // 图片预览对话框的显示与隐藏
      previewDialogVisible: false,
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
        return this.$message.error("获取分类商品数据失败");
      }
      //   console.log(res.data);
      this.cateList = res.data;
    },
    // 选中某一种分类的商品
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        return (this.addForm.goods_cat = []);
      }
    },
    // 切换标签页之前的操作
    beforeLeaveTabs(activeName, oldActiveName) {
      // oldActiveName为即将离开的标签页的值,值为字符串
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("[基本信息]填写栏中请选择商品分类");
        return false;
      }
    },
    // 切换标签页
    tabClicked() {
      // 选中索引为1的标签页
      if (this.activeIndex === "1") {
        this.getAttr("many");
      }
      // 选中索引为2的标签页
      if (this.activeIndex === "2") {
        this.getAttr("only");
      }
    },
    //   获取参数的值
    async getAttr(sel) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: sel },
        }
      );
      if (res.meta.status != 200) {
        return this.$message.error("获取商品动态参数失败");
      }
      res.data.forEach((item) => {
        item.attr_vals =
          item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
      });
      //   console.log(res.data);
      if (sel === "many") {
        this.manyData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 点击图片预览
    handlePreview(file) {
      this.previewDialogVisible = true;
      //   console.log(file);
      this.previewPath = file.response.data.url;
    },
    // 取消选择的图片
    handleRemove(file) {
      //   console.log(file);
      const fileName = file.response.data.tmp_path;
      const index = this.addForm.pics.findIndex((item) => {
        return (item.pic = fileName);
      });
      this.addForm.pics.splice(index, 1);
      //   console.log(this.addForm.pics);
    },
    // 上传成功的回调函数
    uploadSuccess(response) {
      //   console.log(response);
      const successPic = {
        pic: response.data.tmp_path,
      };
      this.addForm.pics.push(successPic);
      //   console.log(this.addForm.pics);
    },
    // 添加商品
    addGoods() {
      this.$refs.addRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项");
        }
        // 将goods_cate从数组转换为字符串
        const addFormCopy = JSON.parse(JSON.stringify(this.addForm));
        addFormCopy.goods_cat = addFormCopy.goods_cat.join(",");

        // console.log(this.manyData);
        // console.log(this.onlyTableData);
        // 处理动态参数
        this.manyData.forEach((item) => {
          const oneManyData = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(","),
          };
          addFormCopy.attrs.push(oneManyData);
        });

        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          const oneOnlyData = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(","),
          };
          addFormCopy.attrs.push(oneOnlyData);
        });

        // console.log(addFormCopy);

        const { data: res } = await this.$http.post("goods", addFormCopy);
        // console.log(res);
        if (res.meta.status != 201) {
          return this.$message.error(res.meta.msg);
        }

        this.$message.success("添加商品成功");
        this.$router.push("/goods");
      });
    },
  },

  computed: {
    //   选择的分类商品Id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 10px;
}
</style>
