<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar">
        <img src="../assets/avatar.jpg" alt="" />
      </div>

      <!-- 登录区域 -->
      <el-form
        ref="loginFormRef"
        class="login_form"
        :model="form"
        :rules="loginRules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-denglu"
            placeholder="username"
            v-model="form.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            class="input"
            prefix-icon="iconfont icon-mimacopy"
            placeholder="password"
            v-model="form.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="login_button ">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
          <el-button type="info">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 表单属性
      form: {
        username: "admin",
        password: "123456",
      },
      // 验证规则
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 重置数据
    reset() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // 登录前验证
      this.$refs.loginFormRef.validate(async (vali, obj) => {
        if (!vali) {
          return;
        }
        const { data: res } = await this.$http.post("/login", this.form);
        if(res.meta.status!=200){
          return  this.$message.error("帐号或密码输入有误哦");
        }
        // this.$message.success("登录成功")
        this.$notify.success({message:"登录成功",duration:1000})
        console.log(res);
        window.sessionStorage.setItem("token",res.data.token)
        this.$router.push('/home')
      });
    },
  },
};
</script>
<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #ff2741;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_box {
  height: 350px;
  width: 560px;
  background-color: #ffffff;
  border-radius: 8px;
  // position: absolute;
  // top:50%;
  // left:50%;
  // transform: translate(-50%,-50%);
  display: flex;
  .avatar {
    height: 150px;
    width: 150px;
    border: 1px solid #e0e0e0;
    border-radius: 50%;
    padding: 5px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
    }
  }
  .login_form {
    align-self: flex-end;
    width: 100%;
    padding: 30px;
    .input {
      margin-top: 30px;
    }
    .login_button {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
