# canvas 函数使用帮助

```js
const canvas = require('../../utils/canvas');

Page({
  data: {
    code: '1234567890123456789'
  },

  onLoad: function() {
    canvas.barcode('barcode', this.data.code, 680, 200);
    canvas.qrcode('qrcode', this.data.code, 420, 420);
  }
})
```

```html
<view class="container page">
  <view class="panel">
    <view class="header">
    </view>
    <view class="barcode">
      <view class="number">{{code}}</view>
      <canvas canvas-id="barcode" />
    </view>
    <view class="qrcode">
      <canvas canvas-id="qrcode" />
    </view>
  </view>
</view>
```
