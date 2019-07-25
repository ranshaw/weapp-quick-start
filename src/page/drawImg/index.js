import 'minapp';
Page({
  data: {},
  onLoad() {
    wx.getSystemInfo({
      success: res => {
        this.rpx = res.windowWidth / 375;
      },
    });
    this.handleCreateCanvas();
  },
  handleCreateCanvas() {
    const rpx = this.rpx;
    const ctx = wx.createCanvasContext('myCanvas');
    // 绘制背景
    ctx.drawImage('../../assets/images/share.png', 0, 0, 375 * rpx, 440 * rpx);
    // 绘制圆形图
    ctx.save(); // 保存画板之前的状态
    ctx.beginPath();
    ctx.arc(62 * rpx, 320 * rpx, 20 * rpx, 0, Math.PI * 2, true);
    ctx.setLineWidth(10 * rpx);
    ctx.setFillStyle('#ffffff');
    ctx.clip();
    ctx.drawImage('../../assets/images/077137361902.jpg', 42 * rpx, 300 * rpx, 40 * rpx, 40 * rpx);
    ctx.restore(); // 恢复画板之前的状态
    // 绘制一个圆，图片的边框
    ctx.beginPath();
    ctx.arc(62 * rpx, 320 * rpx, 20 * rpx, 0, Math.PI * 2, true);
    ctx.setLineWidth(2 * rpx);
    ctx.setStrokeStyle('#ffffff');
    ctx.stroke();
    // 绘制文字
    ctx.setFontSize(20 * rpx);
    ctx.setFillStyle('#ffffff');
    ctx.fillText('哼唧', 98 * rpx, 330 * rpx);

    this.ctx = ctx;
  },
  handleStartDraw() {
    this.ctx.draw();
  },
  onUnload() {},
});
