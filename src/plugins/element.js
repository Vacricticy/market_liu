import Vue from "vue";
import { Button, Form, FormItem, Input, Message } from "element-ui";
// 注册为全局组件
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.prototype.$message = Message;