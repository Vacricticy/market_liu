import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
// 导入全局样式表
import "./assets/css/global.css";
// 导入第三方图标库
import "./assets/font/iconfont.css";
// 导入带有树形结构的表格插件
import ZkTable from "vue-table-with-tree-grid";
//导入axios
import axios from "axios";
//配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// 配置axios请求拦截器实现发送请求时携带token
axios.interceptors.request.use((config) => {
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config;
});
//挂载到原型对象的http属性上
Vue.prototype.$http = axios;

// 将导入的第三方插件注册在全局组件上
Vue.component("tree-table", ZkTable);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");