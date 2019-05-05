import 'minapp';
console.log('env--', env);
App({
  data: {
    preload: null,
  },
  async onLaunch() {
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
