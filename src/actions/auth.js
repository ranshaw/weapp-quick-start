export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_AUTHORIZATION_TOKEN = 'SET_AUTHORIZATION_TOKEN';

import { wechatOAuth, wechatOAuthMobile, userBindMobile } from '/api/auth';
import { getCurrentUserInfo } from '/api/user';
import { store } from '../store';

export const getCurrentUser = async () => {
  const userInfo = await getCurrentUserInfo();

  store.dispatch({
    type: SET_USER_INFO,
    payload: userInfo,
  });

  return userInfo;
};

export const oauth = async existUserInfo => {
  const { sjs, token, flag } = await wechatOAuth(existUserInfo);

  store.dispatch({
    type: SET_AUTHORIZATION_TOKEN,
    payload: token,
  });

  const userInfo = await getCurrentUser();
  // TODO: 石景山的逻辑需要单独优化，与现有的系统解耦
  userInfo.SJS = sjs === 'true';
  userInfo.hasMobile = flag !== 'false';

  return {
    token,
    userInfo,
    sjs,
    hasMobile: userInfo.userMobile,
  };
};

/**
 * 用户微信授权绑定手机号
 *
 * ```js
 * const data = {
 *  encryptedData: '',
 *  iv: ''
 * }
 * ```
 *
 * 响应
 *
 * ```js
 * const response = {
 *   token: ''
 * }
 * ```
 *
 * @param {Object} data
 */
export const oauthMobile = async data => {
  const { token } = await wechatOAuthMobile(data);
  store.dispatch({
    type: SET_AUTHORIZATION_TOKEN,
    payload: token,
  });

  const userInfo = await getCurrentUser();
  userInfo.hasMobile = !!userInfo.mobile;

  return {
    userInfo,
    hasMobile: userInfo.hasMobile,
    token,
  };
};

/**
 * 用户绑定手机号码
 *
 * ```js
 * const data = {
 *   mobile: '',
 *   code: ''
 * }
 * ```
 *
 * 响应：
 *
 * ```js
 * const response = {
 *   token: '',
 *   mobile: ''
 * }
 * ```
 *
 * @param {Object} data
 */
export const bindMobile = async data => {
  const { token } = await userBindMobile(data);
  store.dispatch({
    type: SET_AUTHORIZATION_TOKEN,
    payload: token,
  });

  const userInfo = await getCurrentUser();
  userInfo.hasMobile = !!userInfo.mobile;

  return {
    userInfo,
    hasMobile: userInfo.hasMobile,
    token,
  };
};
