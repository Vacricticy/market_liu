# vue电商项目



## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```



## 1.登录

### 表单中数据的绑定(elementui)

- 外表单绑定一个:model="form"
- 内部输入框双向绑定一个v-model="form.username"
- 密码框加上type="password"属性

### 表单数据验证(elementui)

- form对象绑定验证规则:rules="loginRules"
- 在data中添加验证规则
- 输入框的外部元素绑定具体的验证规则prop=“username”

	- 由于错误信息是显示在el-form-item元素上的，所以验证规则需要绑定在这上面

### 重置帐号密码(elementui)

- 为表单绑定ref
- 点击重置按钮触发函数，函数中调用this.$refs.xxx.resetFields()或this.$refs[xxx].resetFields()

### 点击登录时的预验证(elementui)

- 触发函数调用this.$refs.xxx.validate方法

### 配置axios发送登录请求

- 在main.js中导入axios
- 配置请求的根路径
- 挂载到vue的原型对象上
- 通过this.$http.post('/login',{}')发送请求

### 帐号或密码输入错误的提示(elementui)

- element.js中导入Message或Notification
- 挂载到vue的原型对象上
- 通过this.$message.success("")或this.$notify.success({message:"登录成功",duration:1000})来进行提示

### 登录成功后token的保存和页面的跳转

- 通过window.sessionStorage.setItem("token",xxx)添加token
- 通过this.$router.push('/home')实现路由的跳转

### 请求时检验token是否存在,访问某些页面必须处于登录状态

- 使用路由导航守卫功能
- 在router.js中挂载路由导航守卫vue.beforEach((to,from,next)=>{})
- 通过to.path获取请求的路径
- 判断是否请求的登录页
如果不是则判断是否存在token,不存在就跳至登录页

### 退出登录

- 清除token

	- window.sessionStorage.clear()

- 跳转至login页面

	- this.$router.push('/login')

## 2.首页

### container布局（elementui)

- 头部，侧边栏，主体

### 发送数据请求时携带token

- 在main.js中配置axios请求拦截器：axios.interceptors.request.use(config=>{
config.headers.Authorization = window.sessionStorage.getItem("token");
return config})

### 请求接口后数据的处理

- 服务端返回数据后需要首先判断status的状态是不是200，如果不是，需要给出相应的提示，如果是，才将data中的数据保存起来

### 为v-for渲染出来的菜单项中添加各自的图标样式

- 在data中添加一个对象menu，用于存储id与class类名的对应关系，在v-for循环出来的每一项上通过:class="menu[item.id]"应用相应的class

### 为el-aside在折叠和不折叠的状态动态绑定宽度（elementui）

- aside专有属性：width
- 三元表达式:width="isCollapse?'64px':'200px'

### 二级菜单路由跳转（elementui）

- menu绑定router和default-active属性

### 菜单项设置页面刷新后依然高亮

- 每次点击菜单都通过window.sessionStorage.setItem保存所激活的菜单的状态值，保证刷新页面后依然是原路由

## 3.用户管理

### 3.1导航栏显示

- BreadCrumb面包屑

	- 对于elementui的组件设置自定义样式时可在global.css中进行设置。

### 3.2显示用户列表

- Card卡片

	- Table表格

		- 斑马纹
		- 获取列表中的值：只能使用插槽

			- 表格组件内部已经写好了一个slot默认插槽，并向父组件绑定了每一条记录的属性：scope
			- 父组件通过作用域插槽获取绑定上来的该条记录的值

	- Pagination分页

		- pageSize每一页的记录数量
		- currentPage 当前页码
		- 分页逻辑：
请求的封装体应该是一个对象，包括了查询参数，当前页码数，每一页的记录数。
返回的结果中应包括总记录的数量。

### 3.3搜索用户

- 栅格布局
- 输入框

	- 清空输入框，重新请求数据

### 3.4添加用户

- Dialog对话框

	- 对话框的显示与否是直接由属性的布尔值来决定的
	- 内部可以自定义添加样式，比如Form表单

- 重置添加用户的对话框

	- 触发对话框的close事件将表单清空

- 自定义校验规则实现邮箱和手机格式的验证

	- 邮箱验证的正则表达式

		- /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	- 手机号验证的正则表达式

		- /^(0|86|17951)?(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/

### 3.5编辑用户信息

### 3.6更改用户状态

- Switch开关

	- 切换开关调用@change方法，传入想要检验的值

### 3.7删除用户

- MessageBox

	- 删除用户时弹出是否删除的提示框

### 3.8分配角色

- Tooltip文字提示
- 下拉框

	- 获取所有的角色列表

## 4.权限管理

### 4.1权限列表

- 同上面的显示用户列表1.2

### 4.2角色列表

- 下拉显示角色的权限

	- el-table-column标签设置为type="expand"

- 在下拉列表中采用树形结构显示拥有的权限

	- 采用栅格布局，在el-row中设置span值不同的el-col
	- 居中对齐

- 分配权限

	- 显示所有权限

		- el-tree控件

			- 唯一标识每一个节点

				- node-key="id"

			- 设置树形控件中显示数据的规则

				- :props

			- 设置为可选

				-  show-checkbox

			- 默认全部展开

				-  default-expand-all

			- 设置默认选中的值

				- :default-checked-keys

	- 分配权限

		- 获取所有选择的节点，包括一二三级节点

			- 为tree控件绑定ref属性
			- this.$refs.rightTreeRef.getHalfCheckedKeys()获取半选中的节点
			- this.$refs.rightTreeRef.getCheckedKeys()获取选中的节点

## 5.商品分类管理

### 商品分类数据的显示（树形表格）

- 使用第三方插件vue-table-with-tree-grid
- npm安装后，在main.js中导入插件并注册为全局组件
- 参照github中插件的example和手册自定义设置表格

	- data绑定数据
	- columns设置列的配置
	- expand-type关闭展开样式
	- selection-type关闭可选样式
	- index-text="#"增加索引列

- 对树形表格中列的样式进行自定义

	- 在column属性中设置所采用的类型样式为template

### 分页显示

### 添加分类

- 父级商品列表使用级联的方式显示

	- 级联选择器Cascader

		- option绑定数据
		- props设置级联选择器的配置规则

			- 选中的值value
			- 显示的值label
			- 子选项对应的属性children
			- 展开的方式expandTrigger
			- 取消严格要求的父子节点的关联关系checkStrictly

		- v-model绑定了选中的value值，为一个数组

	- 高度的设置

		- 在全局样式中设置.el-cascader-menu {
    height: 300px;
}

- 关闭对话框时清空数据

	- 由于表单中只有一个元素是由input绑定的，所以其他的表单元素在清空时需要单独清空

- 确认添加分类

	- 预验证
	- 弹出操作成功的提示框
	- 获取新的商品分类列表的数据
	- 关闭对话框

## 6.分类参数管理

### 头部警告区el-alert

- 显示图标
- 隐藏可关闭的按钮

### 控制级联选择器的选中范围，使之只能选中第三级的项目

- 在选中函数中判断选中的值的数组长度是否为3，不为3则清空该数组，表明不起作用

### 动态参数与静态属性页面的切换

- el-tab标签

### 选中第三级商品后才能取消禁用添加按钮

- 通过计算属性判断某一个值是否满足条件来设置想要的值为true或false

### 获取参数列表数据

- 在选中第三级商品时获取数据
- 按照标签页的选择的不同将数据保存在不同的变量中

### 渲染动态参数和静态属性的table表格

### 渲染添加参数和添加属性的对话框

- 共用一个对话框

	- 标题采用计算属性，根据选中的标签页的值的不同返回不同的标题值

### 完后动态参数和静态属性的添加操作

### 修改参数

- 渲染修改参数的对话框
- 完成修改操作

### 删除参数

- 弹出MessageBox提示框

### 分类参数

- 渲染参数下的可选项
- attr_val为空字符串时split时会产生一个带有空元素的数组，会导致渲染el-tag时出现一个空的标签组件。

	- 解决：三元表达式判断，若为空字符串，则直接为数组赋值为[]

- 控制按钮和文本框的切换

	- el-tag组件特有
	- 文本框输入为空时移出则恢复按钮样式，不为空则保持文本框的样式

- 放置所有的输入框出现联动现象

	- 为每一行数据提供单独的inputVisible和inputValue

- 文本框自动获取焦点

	- 业务描述：在点击按钮后，输入框会立即显示，此时输入框会进行对焦的操作

		- 解决：使用this.$nextTick函数，该函数可以使页面渲染完毕（即渲染处输入框后）再执行nextTick内部的focus()获取焦点的代码

- 完成添加操作
- 删除参数下的可选项
- 当选择二级商品时清空表格数据

## 7.商品列表管理

### 格式化时间

- 在main.js中自定义格式化时间的全局过滤器

### 在输入框点击回车立即调用函数发送数据请求

- 为输入框绑定@keyup.enter.native="getxxxx()"

### 添加商品

- 步骤条组件

	- Steps步骤条组件

- tab栏区域居左竖直显示

	- Tabs标签页组件，设置tab-position为left，即居左竖直显示

- 将el-tab-pane包装为表单

	- 由于el-tab-pane只能作为el-tabs的子节点，所以el-form只能包裹el-tabs

- 设置表单域的标签位于输入框的上方

	- 设置label-postion为top

- 当前面的信息没有填写完整时，阻止标签页的切换

	- 使用tabs标签页组件的before-leave属性，绑定一个切换标签页之前调用的处理函数

- 绘制商品参数的复选框

	- 使用Checkbox多选框组件

- 上传图片

	- upload上传组件
	- 浏览器调试页面network项显示上传失败，无效的token

		- 原因：上传头像走的路径不是axios，因此在axios配置的拦截器是无效的。需要单独为upload组件添加header属性。

	- 在upload组件上绑定上传图片成功的回调函数，将响应的结果绑定在添加商品的表单中。
	- 移除图片

		- upload组件绑定移除事件on-remove
		- 获取移除图片文件的路径
		- 在数组中通过findIndex找到索引index
		- 通过splice(index,1)删除索引位置的值

	- 点击图片实现预览效果

		- upload组件绑定图片预览事件on-preview
		- 使用一个dialog对话框，在其中添加一个img标签

	- 富文本编辑器

		- 第三方插件vue-quil-editor
		- 参照官方的文档来使用

	- 添加商品前的预计验证

		- 不符合规范时弹出提示框，相应的不符合规范的表单项会自动给出提示

	- 数组转字符串

		- 问题描述

			- 直接将goods_cat从数组改为字符串会导致级联选择器的连锁反应。因为级联选择器所绑定的goods_cat是数组型的值。所以不能直接在goods_cat上面改。

		- 解决

			- 方式一

				- 使用Lodash工具库深拷贝函数.cloneDeep(value)

			- 方式二

				- 使用JSON.parse(JSON.stringify(value))

## 8.订单管理

### 省市区地区级联选择器

- 数据使用citydata.js

### 以时间轴的方式显示物流信息

- 使用第三方插件vue-cute-timeline

## 9.数据统计

### 百度echarts

## 10.优化和部署项目

### 优化

- 8.1切换页面时为顶部添加加载页面的进度条

	- 使用第三方插件nprogress
	- 导入nprogress插件极其样式
	- 在axios请求拦截器中设置进度条的展示，在响应拦截器中设置进度条的隐藏。

- 8.2解决eslint和代码格式化的冲突

	- 在根目录下的.prettierrc文件中修改相关配置

		- semi:false 设置为全角
		- singleQuote:true 设置为单引号
		- printWidth:200 单行总字符超过200则会自定换行

- 8.3在项目bulid阶段，移除所有的console代码

	- 使用第三方插件babel-plugin-tranfrom-remove-console
	- 在babel.config.js中添加插件配置项
	- 注意：修改配置文件后需要重新npm run bulid才能看到效果 

- 8.4开发环境，不移除console;
生产阶段，才移除console。

	- 问题描述：生产环境中，npm run serve后，控制台的输出不见了。
这是因为生产环境才需要transform-remove-console插件，而开发环境不需要。
	- 在babel.config.js文件中通过process.env.NODE_ENV判断当前的环境是开发环境还是生产环境

		- 开发环境development
		- 生产环境production

	- 若为生产环境，则向插件数组中push一个transform-remove-console插件

- 8.5对项目进行自定义的webpack配置

	- 创建vue.config.js文件，文件需要通过module.exports={}导出一个对象

- 8.6在vue.config.js文件中为开发模式和发布模式指定不同的入口文件

	- 前提：先创建好两个不同的入口文件main-dev.js   main-prod.js
	- 解决

		- 方式一：操作对象

			- 通过configWebpack修改配置

		- 方式二：链式编程

			- 通过chainWebpack修改配置

				- 在vue.config.js中添加chainWebpack属性

- 8.7使用CDN解决打包后文件体积过大的问题

	- 说明

		- 开发模式下，资源的获取是通过import加载的
		- 而在生产环境中，资源的获取可以直接通过加载外部的cdn资源来实现。这样可以减少生产环境中打包资源体积过大的问题。

			- 打包资源体积过大的影响：
体积过大会影响首次加载项目的速度。
使用cdn的方式引入第三方资源，可以实现多个线程异步加载所需要的js,css文件

	- 实现

		- 优化echarts和第三方插件资源

			- 在vue.config.js文件中的发布模式中通过externals排除某些包，让这些包不会被打包到文件中去。
			- 然后在index.html文件中引入cdn上的js和css文件

		- 单独优化elementui的打包

			- 在main.prod,js文件中，注释掉按需加载的代码
			- 在index.html文件中通过cdn加载elementui的js和css样式。

	- 常用的cdn资源地址

		- bootstrap CDN：https://www.bootcdn.cn
Staticfile CDN：https://www.staticfile.org
jsDelivr CDN：https://www.jsdelivr.com
75 CDN：https://cdn.baomitu.com
UNPKG：https://unpkg.com
cdnjs：https://cdnjs.com

- 为开发环境和生产环境设置不同的网页标题

	- 在vue.config.js文件中为html插件声明以一个isProd参数
	- 在index.html中根据参数自定义首页的渲染

		- 自定义标题的渲染
		- 自定义是否采用cdn的形式加载资源

- 实现路由的懒加载

	- 什么是路由懒加载？

		- 打包构建项目时，会把所有的资源打包成一个文件，随着项目的增大，打包的资源体积也会越来越大。用户的加载时间会越来越长。
路由懒加载可以实现将整个打包的资源拆分成chunk块。实现按需加载，按块加载。

	- 实现

		- 使用babel的懒加载插件
		- 在babel.config.js中声明插件
		- 在router.js中修改导入组件的方式

### 上线

- 通过node创建web服务器

	- npm init -y初始化项目
	- npm i express -S安装express
	- 将之前打包的dist目录复制到根目录
	- 创建app.js文件，通过express创建web服务器

		- 创建web服务器
		- 托管静态资源
		- 启动web服务器

	- node ./app,js运行项目

- 为服务器开启gzip网络文件传输压缩

	- npm i compression -S安装compression
	- 在app.js中引入compression
	- app.use(compression())在加载静态资源之前开启gzip压缩

- 配置https服务

	- 导入https和fs
	- 添加公钥和私钥
	- 监听https的443端口

- 使用pm2管理服务器上的网站应用

	- 安装np2

		- npm i np2 -g

	- 启动项目

		- pm2 start 脚本 --name 自定义名称

	- 查看运行项目

		- pm2 ls

	- 重启项目

		- pm2 restart 项目名或项目id

	- 停止项目

		- pm2 stop xxx

	- 删除项目

		- pm2 delete xxx

*XMind - Trial Version*