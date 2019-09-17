import { APP_ID } from '../env';
import request from './request';
import { setAuthorizationToken } from './utils';
import wechat from '/utils/wechat';
/**
 * 微信自动登录
 */
const WECHAT_LOGIN = 'POST /saas-consumer-user-user-service/login';

/**
 * 发送手机验证码
 */
const CREATE_LOGIN_PIN_CODE = 'POST /saas-consumer-user-user-service/sendCode';

/**
 * 用户绑定手机号码
 */
const USER_BIND_MOBILE = 'POST /saas-consumer-user-user-service/save';

/**
 * 用户绑定微信授权得到的手机号码
 *
 * 提交给服务器的数据为当前获取到的值
 */
const WECHAT_OAUTH_MOBILE = 'POST /saas-consumer-user-user-service/oauth/wechat-mobile';

/**
 * 发送登录验证码
 *
 * @param {Object} data
 */
export function createLoginPinCode(data) {
  return request(CREATE_LOGIN_PIN_CODE, {
    data,
    authorizationRequired: false,
  });
}

/**
 * 微信自动登录
 *
 * @param {Object} data
 */
export function wechatLogin({ code: jsCode, userInfo, ...rest }) {
  return request(WECHAT_LOGIN, {
    data: { jsCode, userInfo, appId: APP_ID, ...rest },
    authorizationRequired: false,
  }).then(({ token, ...rest }) => {
    setAuthorizationToken(token);
    return {
      ...rest,
      token,
    };
  });
}

/**
 * 绑定手机号
 */
export function userBindMobile(data) {
  return request(USER_BIND_MOBILE, { data }).then(token =>
    typeof token === 'string' ? { token } : token
  );
}

/**
 * 用户绑定微信授权手机号
 *
 * ```js
 * const data = {
 *    encryptedData: '',
 *    iv: ''
 * }
 * ```
 *
 * 响应
 *
 * ```js
 * const response = {
 *   token: '',
 *   mobile: ''
 * }
 * ```
 *
 * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html
 *
 * @param {Object} data
 */
export function wechatOAuthMobile({ code: jsCode, ...data }) {
  return request(WECHAT_OAUTH_MOBILE, { data: { ...data, jsCode, appId: APP_ID } });
}

/**
 * 微信 OAuth 登录
 * @param {Object} userInfo 微信用户信息
 */
export async function wechatOAuth(existedUserInfo, options = {}) {
  let userInfo = existedUserInfo;

  const { code } = await wechat.login();

  // TODO: 这里需要确认，通过 button opentype 为 getUserInfo 得到的用户信息之后，是否还可以 wechat.login
  // if (!userInfo) {
  // 获取微信 setting
  const setting = await wechat.getSetting();
  // 若没有权限获取 userInfo
  if (!setting.authSetting['scope.userInfo']) {
    // 前往用户信息授权页面
    throw new Error('wechat.authorization');
  }

  // 获取用户信息
  const { userInfo: user, ...rest } = await wechat.getUserInfo();

  userInfo = Object.assign(user, rest);
  // }

  // 请求后端接口完成登录
  const data = await wechatLogin({
    code,
    userInfo,
  });

  if (!data || data === null) {
    throw new Error('服务响应出错');
  }

  await wechat.setStorage({
    key: 'token',
    data: data.token,
  });

  return data;
}
