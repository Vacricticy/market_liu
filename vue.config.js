module.exports = {
    chainWebpack: (config) => {
        // 生产模式
        config.when(process.env.NODE_ENV === "production", (config) => {
            config
                .entry("app")
                .clear()
                .add("./src/main-prod.js");

            // 生产环境在打包时，如果import了vue-router，则不会被打包至dist，而是通过win全局去找VueRouter
            config.set("externals", {
                vue: "Vue",
                "vue-router": "VueRouter",
                axios: "axios",
                echarts: "echarts",
                nprogress: "NProgress",
                "vue-quill-editor": "VueQuillEditor",
            });

            // 生产环境中为html插件添加一个isProd属性，实现生产环境不加dev-标题，且采用cdn的方式加载资源
            config.plugin('html').tap(args => {
                args[0].isProd = true;
                return args;
            })
        });
        // 开发模式
        config.when(process.env.NODE_ENV === "development", (config) => {
            config
                .entry("app")
                .clear()
                .add("./src/main-dev.js");

            // 开发环境中为html插件添加一个isProd属性，实现生产环境加上dev-标题，且不采用cdn的方式加载资源
            config.plugin('html').tap(args => {
                args[0].isProd = false;
                return args;
            })
        });
    },
};