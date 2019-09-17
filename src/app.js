import 'minapp';
import launch from './launch';
App({
  data: {
    preload: null,
  },
  globalData: {
    statusBarHeight: 88,
  },
  async onLaunch(options) {
    // 扩展 App
    launch(this, options);
    const n = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1);
      }, 3000);
    });
    console.log(n);
  },
  onShow: function() {
    console.log('App Show');
  },
  onHide: function() {
    console.log('App Hide');
  },
});
