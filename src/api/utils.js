import wechat from '../utils/wechat';
import { HTTP_METHODS } from './constants';

const AUTHORIZATION_TOKEN_STORAGE_KEY = '@@api-authorization-token';

/**
 * 获取 `../utils/wxRequest` 产生的 `token`
 */
const getLegacyToken = async () => {
  try {
    const { data: legacyToken } = await wechat.getStorage({
      key: 'token',
    });
    if (legacyToken) {
      await wechat.setStorage({
        key: AUTHORIZATION_TOKEN_STORAGE_KEY,
        data: {
          expireTime: new Date(new Date().valueOf() + 7200),
          token: legacyToken,
        },
      });
      return legacyToken;
    }
    return null;
  } catch (_) {
    return null;
  }
};

/**
 * 检测是否是合法的HTTP请求
 * @param method 请求方法名称
 */
const isValidHttpMethod = method => HTTP_METHODS.includes(method.toUpperCase());

/**
 * 获取认证Token
 */
const getAuthorizationToken = async () => {
  try {
    let { data: authorizationToken } = await wechat.getStorage({
      key: AUTHORIZATION_TOKEN_STORAGE_KEY,
    });

    if (!authorizationToken) {
      // 若不存在，尝试从 `token` 中取

      const legacyToken = await wechat.getStorage({
        key: 'token',
      });

      if (legacyToken) {
        this.setAuthorizationToken(legacyToken);
        return legacyToken;
      }
      return null;
    }

    const { token, expireTime } = JSON.parse(authorizationToken);

    if (!expireTime || !token) {
      return getLegacyToken();
    }
    return token;
    // const expire = new Date(expireTime);
    // const now = new Date();
    // if (now < expire) {
    //   return token;
    // } else {
    //   return getLegacyToken();
    // }
  } catch (error) {
    return getLegacyToken();
  }
};

/**
 * 缓存认证 Token
 * @param tokenObject AuthorizationToken
 */
const setAuthorizationToken = async token => {
  const tokenObject =
    typeof token === 'object'
      ? token
      : {
          token,
          expireTime: new Date(new Date().valueOf() + 3600000 * 24 * 30),
        };
  try {
    const succeed = await wechat.setStorage({
      key: AUTHORIZATION_TOKEN_STORAGE_KEY,
      data: tokenObject,
    });

    if (succeed) {
      // 成功逻辑
    } else {
      // 失败逻辑
    }
  } catch (error) {}
};

module.exports = {
  isValidHttpMethod,
  getAuthorizationToken,
  setAuthorizationToken,
};
