## 在线选房小程序

采用原生小程序+weappx,支持多种插件和特性，包含开发小程序开发常用的示例。

## 特性
* 支持 npm 包引入
* 支持 promise, async/await 等最新语法
* 支持多种编译器，如 pug/less/stylus
* 支持 ESlint
* 支持本地 mock 数据
* 支持发布前资源压缩

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
新建page页面或者组件页面
```javascript
npm run new
```
开启mock服务
```javascript
weapp-start mock
```
 自动格式化代码
```javascript
npm run format
```
## 优化

#### 1.状态处理逻辑
对于需要共享状态的页面，新建一个store，多个页面共享这个store,如果页面卸载，
在onUnload的时候将store中的数据清除掉，释放内存；如果不需要共享状态，逻辑在页面
或者组件内部处理；状态改变频繁的功能，单独封装为小程序的组件。

#### 2.预加载数据
在页面跳转的同时，请求即将到达页数据。参考example示例中的预加载

#### 3.防止快速点击按钮触发多次跳转
参照example中的预加载按钮

## 注意
如果为window开发环境，需要修改依赖weapp-plugin-require中lib文件夹下的index.js，
在118行和197行后面添加如下代码
```javascript
relativeDistPath = relativeDistPath.replace(/\\/g, '/')

