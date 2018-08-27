## 在线选房小程序

采用原生小程序+weappx开发

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
会生成一个dist文件夹，用小程序开发工具打开此文件夹，即可预览

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

## 参考文档

[项目脚手架参考](https://github.com/tolerance-go/weapp-start)

[状态管理框架](https://github.com/tolerance-go/weappx)

[小程序文档](https://developers.weixin.qq.com/miniprogram/dev/)
