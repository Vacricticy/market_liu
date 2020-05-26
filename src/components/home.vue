<template>
  <el-container class="homePage">
    <el-header>
      <div>
        <div class="avatar">
          <img src="../assets/avatar.jpg" alt="" />
        </div>
        <span>小红书后台管理页面</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="collapse" @click="collapse">|||</div>
        <!-- 菜单区域 -->
        <el-menu
          background-color="#fff"
          text-color="#000"
          active-text-color="#ff93a1"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activeMenu"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="menuIcon[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="setActiveMenu('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 内容 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: [],
      menuIcon: {
        125: "iconfont icon-yonghuguanli",
        103: "iconfont icon-quanxianguanli",
        101: "iconfont icon-shangpinguanli",
        102: "iconfont icon-dingdanguanli",
        145: "iconfont icon-shujutongji",
      },
      isCollapse: false,
      activeMenu: "",
    };
  },
  created() {
    this.getMenu();
    this.activeMenu = window.sessionStorage.getItem("activeMenu");
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      // this.$message.success("退出登录成功");
      this.$router.push("/login");
      this.$notify.success({ message: "退出登录成功", duration: 1000 });
    },
    // 获取菜单名
    async getMenu() {
      const { data: res } = await this.$http.get("/menus");
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
      // console.log(this.menuList);
    },
    // 折叠功能
    collapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存并设置当前激活的路由,保证页面刷新后显示的仍然是原路由
    setActiveMenu(activeMenu) {
      window.sessionStorage.setItem("activeMenu", activeMenu);//保证页面刷新后显示的仍然是原路由
      this.activeMenu = activeMenu;
    },
  },
};
</script>
<style lang="less" scoped>
.homePage {
  height: 100%;
}
.el-header {
  background-color: #ff2741;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: aliceblue;
  font-size: 23px;
  font-weight: bold;
  letter-spacing: 0.1em;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
  .avatar {
    width: 45px;
    height: 45px;
    border: 1px solid #e0e0e0;
    border-radius: 50%;
    box-shadow: 0 0 12px #fff;
    padding: 1px;
    background-color: #fff;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .el-button {
    background-color: #ff93a1;
    border: none;
  }
}
.el-aside {
  // background-color: #ff93a1;
  background-color: #fff;
  .el-menu {
    border-right: none;
  }
  .collapse {
    color: aliceblue;
    background-color: #ff93a1;
    text-align: center;
    line-height: 25px;
    letter-spacing: 0.1em;
    cursor: pointer;
  }
}
.el-main {
  background-color: #f8f8f8;
}
.iconfont {
  margin-right: 10px;
}
</style>
