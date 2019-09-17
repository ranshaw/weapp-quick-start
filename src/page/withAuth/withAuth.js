import wechat from '/utils/wechat';

Page({
  handleAuthUserInfo(e) {
    console.log('userInfo authed: ', e.detail);

    wechat.navigateTo({
      url: '/apps/hospital/index',
    });
  },
});
