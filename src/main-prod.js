import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 通过cdn的方式加载资源
// import "./plugins/element.js";
// 导入全局样式表
import "./assets/css/global.css";
// 导入第三方图标库
import "./assets/font/iconfont.css";
// 导入带有树形结构的表格插件
import ZkTable from "vue-table-with-tree-grid";
//导入axios
import axios from "axios";

// 导入第三方富文本编辑器组件
import VueQuillEditor from "vue-quill-editor";
// 导入富文本编辑器的样式文件
// (生产环境中使用cdn引入资源，可以减少打包后dist的体积)
// import "quill/dist/quill.core.css"; // import styles
// import "quill/dist/quill.snow.css"; // for snow theme
// import "quill/dist/quill.bubble.css"; // for bubble theme

// 导入第三方插件-进度条极其样式
// (生产环境中使用cdn引入资源，可以减少打包后dist的体积)
import NProgress from "nprogress";
// import "nprogress/nprogress.css";

//配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// 配置axios请求拦截器实现发送请求时携带token
axios.interceptors.request.use((config) => {
    NProgress.start();
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config;
});
axios.interceptors.response.use((config) => {
    NProgress.done();
    return config;
});
//挂载到原型对象的http属性上
Vue.prototype.$http = axios;

// 将导入的第三方插件注册在全局组件上
Vue.component("tree-table", ZkTable);
// 自定义格式化时间的全局过滤器
Vue.filter("dateFormat", function(originDate) {
    const dt = new Date(originDate);
    const y = dt.getFullYear();
    const m = (dt.getMonth() + 1 + "").padStart(2, "0");
    const d = (dt.getDate() + "").padStart(2, "0");

    const hh = (dt.getHours() + "").padStart(2, "0");
    const mm = (dt.getMinutes() + "").padStart(2, "0");
    const ss = (dt.getSeconds() + "").padStart(2, "0");
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});
Vue.config.productionTip = false;
// 将富文本编辑器注册为全局组件
Vue.use(VueQuillEditor /* { default global options } */ );

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");