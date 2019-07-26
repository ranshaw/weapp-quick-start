## 快速开发小程序脚手架

采用原生小程序开发,支持多种插件和特性，包含开发小程序开发常用的示例。

## 特性

- 支持 npm 包引入
- 支持 promise, async/await 等最新语法
- 支持多种编译器，如 pug/less/stylus
- 支持 ESlint
- 支持本地 mock 数据
- 支持发布前资源压缩

## Install

安装脚手架工具

```javascript
npm i weapp-start -g
```

安装依赖

```javascript
npm install
```

开启实时编译

```javascript
npm run dev
```

打包生产代码

```javascript
npm run build
```

新建 page 页面或者组件页面

```javascript
npm run new
```

开启 mock 服务

```javascript
npm run mock
```

自动格式化代码

```javascript
npm run format
```

## 目录结构

```
├── README.md                 // 说明文档
├── dist                      // 编译后的代码，用小程序开发工具打开此文件夹
├── mock.js                   // 模拟数据的文件
├── package-lock.json
├── package.json
├── project.config.json       // 项目配置文件
├── src                       // 项目代码都在这个文件夹下
│   ├── app.js                // 等同于小程序根目录下的app.js
│   ├── app.json              // 等同于小程序根目录下的app.json
│   ├── app.wxss              // 等同于小程序根目录下的app.wxss
│   ├── assets                // 项目中使用到的静态资源
│   │   └── images
│   │       ├── example
│   │       └── tab
│   ├── components            // 公用的组件
│   ├── page                  // 存放小程序的各个页面文件
│   │   ├── example           // example 页面
│   │   │   ├── components    // example页面中的组件
│   │   │   ├── index.js
│   │   │   ├── index.json
│   │   │   ├── index.wxml
│   │   │   ├── index.wxss
│   │   │   ├── services      // example页面中接口
│   │   │   ├── template      // example页面中的模板
│   │   │   └── wxs           // example页面中的wxs文件
│   │   ├── globalStore.js    // 全局共享的数据
│   │   └── test
│   │       ├── index.js
│   │       ├── index.json
│   │       ├── index.wxml
│   │       └── index.wxss
│   ├── template              // 公用的模板
│   └── utils                 // 公用的方法或工具
│       ├── config.js         // 全局的一些配置信息
│       ├── create.js         // 状态管理插件
│       ├── mitt.js           // 状态管理插件
│       ├── obaa.js           // 状态管理插件
│       ├── util.js           // 公用方法
│       ├── wxRequest.js      // 封装的小程序请求数据方法
│       └── wxapi.js          // 对小程序api进行Promise封装
└── weapp.config.js           // 对脚手架的配置文件
```

## 开发

#### 1.状态处理逻辑

全局数据放到 globalStore 中，页面可以单独新建 store，优化页面和组件的通信方式，[详细介绍点击](https://github.com/ranshaw/omi-mp-create-demo)

```
    // 监听子组件事件
    this.store.emitter.on('plus', this.plus);
    this.store.emitter.on('subtract', this.sub);
    // 子组件
    this.store.emitter.emit('plus', { a: 'b' });
    this.store.emitter.emit('subtract', { a: 'b' });
```

#### 2.预加载数据

在页面跳转的同时，请求即将到达页数据。参考 example 示例中的预加载

#### 3.防止快速点击按钮触发多次跳转

参照 example 中的预加载按钮

#### 4.对小程序原生 api 做了 promise 封装

#### 5. 组件的嵌套不能超过 3 层，2 层最佳。

#### 6. 利用 mock.js 模拟数据

mock 文件夹下只有后缀名为 .js 的文件会被选中，文件名称对于接口没有影响，可以自由组织

#### 7. 新增**weapp-plugin-require** 的 alias 配置项，原插件不支持，需单独下载，地址在下面

```
    // 在weapp.config.js添加配置
    [
      'weapp-plugin-require',
      {
        alias: {
          utils: path.resolve(__dirname, 'src/utils/'),
          components: path.resolve(__dirname, 'src/components/'),
          template: path.resolve(__dirname, 'src/template/'),
          page: path.resolve(__dirname, 'src/page/'),
        },
      },
    ]
    // 在代码中引用
    import create from '/utils/create';
    import store from '/page/globalStore';
```

#### 8. 在页面中引入 `import 'minapp'`，增加对小程序 API 的代码提示，

#### 9. 新增生成模板配置，新建文件夹的时候，自动生成根据模板配置的文件，vscode 需要安装插件 dot-template 插件，

详细使用教程查看[使用教程](https://github.com/qiu8310/dot-template/blob/master/ARTICLE_ABOUT_IT.md)

## 参考文档

[状态管理](https://github.com/Tencent/omi/tree/master/packages/omi-mp-create)

[vsCode 代码提示](https://qiu8310.github.io/minapp/docs/doc-how-to-use-wxp-in-other-project.html)
