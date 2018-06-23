# webgl-display

> A project to display complex webgl model better.

基于vue全家桶、nodejs和mysql的全站项目。

前端使用axios与后台api交互获取数据，vue全家桶进行数据的管理和渲染，mysql存储需要的数据，nodejs主要提供api接口。



##项目结构

```
    .
    ├── build/                      # webpack 配置文件
    │   └── ...
    ├── config/
    │   ├── index.js                # 项目主要配置文件
    │   └── ...
    ├── build/                      # 编译产生的文件，可以直接使用
    │   ├── static/                 # 静态文件
    │   |   └── ...
    │   └── index.html              # 主页
    ├── server                      # 服务器文件
    │   ├── api/                    # api接口文件
    │   |   └── ...
    │   └── public/                 # 静态文件及上传的文件
    │       └── ...
    ├── src                         # 前端主文件
    │   ├── assets                  # 静态资源
    │   │   ├── font
    │   │   ├── img
    │   │   └── scss
    │   ├── components              # 单个组件
    │   |   └── ...
    │   ├── router/                 # vue-router文件夹
    │   |   └── index.js
    │   ├── store/                  # vuex文件夹
    │   |   └── index.js
    |   ├── views                   # 页面级组件
    │   |   └── ...
    │   ├── App.vue                 # main app 组件
    │   ├── main.js                 # 项目入口文件
    │   └── storage.js              # localStorage的js文件 
    ├── static/                     # pure static assets (directly copied)
    ├── .babelrc                    # babel config
    ├── .editorconfig               # indentation, spaces/tabs and similar settings for your editor
    ├── .eslintrc.js                # eslint config
    ├── .eslintignore               # eslint ignore rules
    ├── .gitignore                  # sensible defaults for gitignore
    ├── .postcssrc.js               # postcss config
    ├── index.html                  # index.html template
    ├── package.json                # build scripts and dependencies
    └── README.md                   # README file
```



## 主要功能

- [x] 增加、修改、删除项目
- [x] 上传、删除模型
- [x] 模型拖拽排序
- [x] 选择单独查看的模型
- [x] 按顺序展示模型



## 跨域

前后端分离，就会面临着跨域问题，比较常用的跨域CORS，proxy代理以及nginx反向代理

在开发环境中我使用了proxy代理的方式，通过在`config/index.js`下面设置

```
proxyTable: {
  '/': {
    target: 'http://localhost:3000',
    changeOrigin: true
  }
}，
```

我们前端服务为`8080`，当我们访问`/**`的时候，便会转发到端口为`3000`的服务上



## Build Setup

``` bash
# 进入项目文件夹
cd webgl-display

# install dependencies
npm install

# 启动后台服务
node app.js

# 再启动前台
npm run dev

# build for production with minification
npm run build
```
