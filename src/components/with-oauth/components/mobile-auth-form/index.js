const app = getApp();

Component({
  properties: {
    // 是否允许跳过手机授权
    allowSkip: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    mobile: '',
    code: '', // 验证码
    pinCodeSent: false,
    countdown: 0, // 倒计时
    sending: false, // 是否正在发送验证码
    loading: false, // 是否正在登录
    agreed: true, // 是否已同意服务协议
    inOAuth: false, // 是否处于用户授权微信手机号过程中
    wechatSessionCode: '',
  },

  lifetimes: {
    attached: function() {
      this.init();
    },
  },

  methods: {
    init: async function init() {
      // 为了防止多次调用 login 之后，导致 session_key 不一致的问题，在组件初始化时，就立即登录刷新 session_key
      const { code: wechatSessionCode } = await app.wechat.login();

      this.setData({
        wechatSessionCode,
      });
    },
    syncData: function(data = {}) {
      return new Promise(resolve => {
        this.setData(data, resolve);
      });
    },
    oauthMobile: async function oauthMobile(data) {
      await this.syncData({ loading: true });
      try {
        const { mobile } = await app.actions.oauthMobile({
          ...data,
          code: this.data.wechatSessionCode,
        });
        await this.syncData({ loading: false });
        this.triggerEvent('auth', {
          value: mobile,
        });
      } catch (error) {
        app.toast(error.message);
        this.triggerEvent('oauth:fail', { error });
        await this.syncData({ loading: false });
      }
    },
    bind: async function bind() {
      const { loading, sending, pinCodeSent, mobile, code, agreed } = this.data;
      if (loading || sending || !pinCodeSent) {
        return;
      }

      if (!agreed) {
        return app.toast('您必须同意宠爱天下《用户服务协议》才能继续');
      }

      if (mobile.length !== 11) {
        return app.toast('请填写正确的手机号码');
      }
      if (code.length !== 4) {
        return app.toast('请填写正确的验证码');
      }
      await this.syncData({ loading: true });
      try {
        await app.actions.bindMobile({
          mobile: this.data.mobile,
          code: this.data.code,
        });
        await app.oauth();
        this.syncData({ loading: false });

        this.triggerEvent('auth', {
          value: this.data.mobile,
        });
        this.syncData({ loading: false });
      } catch (error) {
        this.syncData({ loading: false });
        app.toast(error.message);
      }
    },

    sendPinCode: async function sendPinCode() {
      if (this.data.sending || this.data.countdown > 0) {
        return;
      }
      if (!this.data.mobile) {
        return app.toast('请输入手机号码');
      }
      try {
        await this.syncData({ sending: true });

        await app.api.auth.createLoginPinCode({ mobile: this.data.mobile });

        await this.syncData({ sending: false, pinCodeSent: true });

        this.countdown();
      } catch (error) {
        this.syncData({ sending: false });
      }
    },

    /**
     * 倒计时
     *
     * @param {Number} seconds 倒计时多少秒
     */
    countdown: async function countdown(seconds = 60) {
      await this.syncData({ countdown: seconds });
      if (seconds > 0) {
        await app.delay();
        this.countdown(seconds - 1);
      }
    },

    handleFieldChange(e) {
      const {
        currentTarget: {
          dataset: { field },
        },
        detail: { value },
      } = e;

      this.setData({
        [field]: value,
      });
    },

    handleSendPinCodeTap: function handleSendPinCodeTap() {
      this.sendPinCode();
    },

    handleSubmitTap: function handleSubmitTap() {
      this.bind();
    },

    handleAgreementTap() {
      this.setData({
        agreed: !this.data.agreed,
      });
    },

    handleWechatOAuthButtonTap() {
      this.setData({
        agreed: true,
        inOAuth: true,
      });

      this.triggerEvent('oauth:start', {});
    },

    handleSkipButtonTap() {
      this.triggerEvent('skip', {});
    },

    handleKeyboardHeightChange(e) {
      const { height } = e.detail;
      const { field } = e.currentTarget.dataset;

      this.setData({
        keyboardHeight: height,
        keyboardPlaceholdViewHeight: field === 'code' ? height + 50 : height,
      });
    },

    handleGetPhoneNumber(e) {
      const { errMsg, ...data } = e.detail;

      if (errMsg === 'getPhoneNumber:fail user deny') {
        app.toast('若要再次授权手机号，请手机点击：使用微信手机号按钮');

        this.triggerEvent('cancel');
      } else {
        this.oauthMobile(data);
      }
    },
  },
});
