const app = getApp();

Component({
  behaviors: [],

  // 属性定义（详情参见下文）
  properties: {
    /**
     * 授权类型
     *
     * - `userInfo`：获取用户信息
     * - `mobile`：获取手机号码
     * - `location`：地址列表
     * - `geo`：地理位置
     */
    type: {
      type: String,
      optionalTypes: [Array],
      value: 'userInfo',
    },

    /**
     * 是否跳过询问页直接展示微信授权弹框
     */
    skipAction: {
      type: Boolean,
      value: true,
    },

    /**
     * 若 `type` 为 `mobile` 时，是否允许跳过手机授权
     */
    allowSkipMobile: {
      type: Boolean,
      value: false,
    },
  },

  observers: {
    /**
     * 根据 userInfo 以及 type 设置 needAuth 是否为 `true`（即是否还需要走授权流程）
     */
    'userInfo, type': function userInfoObserver(userInfo, type) {
      const needMobile = type === 'mobile' || (Array.isArray(type) && type.includes('mobile'));
      const hasUserInfo = userInfo && typeof userInfo === 'object';
      const hasMobile =
        hasUserInfo && typeof userInfo.mobile === 'string' && userInfo.mobile.length === 11;

      let needAuth = !hasUserInfo;

      if (needMobile) {
        needAuth = !hasMobile;
      }

      this.setData({
        needAuth,
        hasUserInfo,
        hasMobile,
        needMobile,
      });
      if (!needAuth) {
        this.setData({
          actionModalVisible: false,
          animation: '',
          loading: false,
        });
      }
    },
  },

  data: {
    userInfo: null,
    needAuth: true,
    actionModalVisible: false,
    hidden: false,
    animation: '',
    loading: false,
    hasUserInfo: false,
    hasMobile: false,
  },

  lifetimes: {
    attached: function() {},
    moved: function() {},
    detached: function() {},
  },

  ready: function() {
    setTimeout(() => {
      this.autoAuth();
    }, 250);
  },

  pageLifetimes: {
    show: function() {
      if (this.data.hidden) {
        this.autoAuth();
        this.setData({
          hidden: false,
        });
      }
    },
    hide: function() {
      this.setData({
        hidden: true,
      });
    },
    resize: function() {},
  },

  methods: {
    authed: function authed(extra) {
      const { type, skipAction } = this.properties;
      const { userInfo } = this.data;

      this.setData({
        actionModalVisible: false,
      });

      this.triggerEvent('auth', {
        type,
        skipAction,
        userInfo,
        extra,
      });
    },
    autoAuth: async function autoAuth() {
      const authState = app.globalState.auth;
      try {
        if (authState.userInfo) {
          return this.syncAuthState(authState);
        } else {
          await app.oauth();
          this.syncAuthState(app.globalState.auth);
        }
      } catch (error) {
        const { message } = error;
        if (message === 'wechat.authorization') {
          this.setData({
            needAuth: true,
          });
        }
      }
    },
    syncAuthState(state = {}) {
      /**
       * TODO: 还需要增加对 expireTime, token 的校验，若 token 过期，则需要自动重新登录
       */
      const { userInfo } = state;
      if (userInfo) {
        this.setData({
          userInfo,
        });
        return true;
      }
      return false;
    },

    startLoading() {
      this.setData({
        loading: true,
      });
    },
    stopLoading() {
      this.setData({
        loading: false,
      });
    },
    animateIn() {
      this.setData({
        actionModalVisible: true,
        animation: 'in',
      });

      console.log(this.data);

      setTimeout(() => {
        this.setData({
          animation: '',
        });
      }, 300);
    },
    animateOut() {
      this.setData({
        animation: 'out',
      });

      setTimeout(() => {
        this.setData({
          actionModalVisible: false,
          animation: '',
        });
      }, 300);
    },
    handleTriggerTap: function(e) {
      this.animateIn();
    },
    handleMaskTap: function(e) {
      this.animateOut();
    },
    handleMobileAuth: function(e) {
      const { value } = e.detail;
      this.authed({ mobile: value });
    },
    // 手机号开放授权开始（用户选择授权使用微信手机号流程开始）
    handleMobileOAuthStart: function(e) {},
    handleMobileOAuthCancel: function(e) {
      this.animateOut();
    },
    handleMobileOAuthFail: function() {
      this.animateOut();
    },
    handleMobileOAuthSkip: function(e) {
      this.animateOut();
      this.authed({ mobile: 'skipped' });
    },
    handleTriggerButtonTap: function() {
      this.setData({
        actionModalVisible: false,
        animation: 'false',
      });
    },
    handleGetUserInfo: async function handleGetUserInfo(e) {
      if (e.detail.errMsg === 'getUserInfo:ok') {
        const { userInfo, ...rest } = e.detail;
        Object.assign(userInfo, rest);
        // 请求后端接口完成登录
        try {
          this.startLoading();
          await app.oauth(userInfo);
          this.stopLoading();
          if (this.syncAuthState(app.globalState.auth)) {
            console.log(this.data);
            if (this.data.needMobile && !this.data.hasMobile) {
              this.animateIn();
            } else {
              this.authed();
            }
          }
        } catch (error) {
          app.wechat.showToast({
            title:
              error.message === 'wechat.authorization' ? '您未授权小程序,请先授权' : error.message,
            icon: 'none',
            duration: 1500,
          });
          this.stopLoading();
        }
      } else {
        app.wechat.showToast({
          title: '您未授权小程序,请先授权',
          icon: 'none',
          duration: 1500,
        });
      }
    },
  },
});
