## 快速开发小程序脚手架

采用原生小程序+weappx,支持多种插件和特性，包含开发小程序开发常用的示例。

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
weapp-start mock
```

自动格式化代码

```javascript
npm run format
```

## 优化

#### 1.状态处理逻辑

全局数据放到 globalStore 中，页面可以单独新建 store，优化页面和组件的通信方式，[详细介绍点击](https://github.com/Tencent/omi/tree/master/packages/omi-mp-create)

#### 2.预加载数据

在页面跳转的同时，请求即将到达页数据。参考 example 示例中的预加载

#### 3.防止快速点击按钮触发多次跳转

参照 example 中的预加载按钮

#### 4.对小程序原生 api 做了 promise 封装

## 注意

如果为 window 开发环境，需要修改依赖 weapp-plugin-require 中 lib 文件夹下的 index.js，
在 118 行和 197 行后面添加如下代码

```javascript
relativeDistPath = relativeDistPath.replace(/\\/g, '/');
```
