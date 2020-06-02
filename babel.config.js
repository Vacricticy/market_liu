const prodPlugins = [];
if (process.env.NODE_ENV === "production") {
    // 添加移除console的插件
    prodPlugins.push("transform-remove-console");
}

module.exports = {
    presets: ["@vue/cli-plugin-babel/preset"],
    plugins: [
        [
            "component",
            {
                libraryName: "element-ui",
                styleLibraryName: "theme-chalk",
            },
        ],
        // 发布产品时的插件数组
        ...prodPlugins,
        // 路由懒加载插件
        "@babel/plugin-syntax-dynamic-import",
    ],
};