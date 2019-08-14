import 'minapp';
import wxapi from '/utils/wxapi';
Page({
  data: {
    bgImgHeight: '100vh',
  },
  onLoad() {
    wx.getSystemInfo({
      success: res => {
        this.rpx = res.windowWidth / 375;
        this.pixelRatio = res.pixelRatio;
        console.log('设备信息---', res);
      },
    });
    this.handleCreateCanvas();
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success: function(res) {
        console.log(res);
      },
    });
  },
  getLocalPath(url) {
    return wxapi('getImageInfo', { src: url }).then(res => {
      return res.path;
    });
  },
  handleCreateCanvas() {
    const rpx = this.rpx;
    const ctx = wx.createCanvasContext('myCanvas');
    const url = 'https://ranshaw.oss-cn-shanghai.aliyuncs.com/test/course.png';
    // wx.getImageInfo({
    //   src: url,
    //   success: res => {
    //     console.log('path', res.path, res);
    //     ctx.drawImage(res.path, 0, 0, 375, res.height);
    //     this.setData({
    //       bgImgHeight: res.height,
    //     });
    //     this.ctx = ctx;
    //   },
    // });
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
    // this.ctx.draw();
    // wx.showLoading();
    this.ctx.draw(false, function() {
      console.log('绘制完成');
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 375,
        height: 6648,
        destWidth: 750,
        destHeight: 6648,
        canvasId: 'myCanvas',
        complete() {
          console.log('获取路径完毕');
        },
        success: res => {
          console.log('data:');
          console.log('得到临时路径---', res);
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            // 保存成功失败之后，都要隐藏画板，否则影响界面显示。
            success: res => {
              console.log(res);
              wx.hideLoading();
            },
            fail: err => {
              console.log(err);
              wx.hideLoading();
            },
          });
        },
        fail(err) {
          console.log('拿到临时路径失败---', err);
        },
      });
    });
  },
});
