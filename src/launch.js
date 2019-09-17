import Moment from 'moment';
import SparkMD5 from 'spark-md5';
import wechat from '/utils/wechat';
import api from '/api/index';
import canvasUtils from '/utils/canvas/index';
import actions from './actions/index';
import utils from './utils/doggy';
import { store } from './store';
import * as env from './env';

// const isProduction = env.ENV === 'production';

export default function launch(app, options = {}) {
  /**
   * 更新启动参数
   */
  actions.launch(options);

  /**
   * 系统信息
   */
  app.globalData.systemInfo = wechat.getSystemInfoSync();

  /**
   * 若为开发或者测试环境，默认启动 `debug` 模式，若为生产环境，默认关闭 `debug` 模式
   *
   * https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/wx.setEnableDebug.html
   *
   * 已更新微信管理配置，不再需要开启 Debug 模式
   */
  // if (wechat.canIUse('setEnableDebug')) {
  //   // 在调试工具中不支持 `setEnableDebug` 功能，所以，下面的代码需要 `catch` error
  //   if (!isProduction) {
  //     wechat
  //       .setEnableDebug({
  //         enableDebug: true,
  //       })
  //       .catch(_ => {});
  //   } else {
  //     wechat
  //       .setEnableDebug({
  //         enableDebug: false,
  //       })
  //       .catch(_ => {});
  //   }
  // }

  const logManager = wechat.getLogManager({ level: env.LOGGER_LEVEL });

  /**
   * 日志管理器
   *
   * https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/wx.getLogManager.html
   *
   * 通过 LogManager 保存的日志，需要用户主动上传，具体文档参见：
   *
   * https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/LogManager.html
   */
  Object.defineProperty(app, 'logManager', { value: logManager });
  Object.defineProperty(app, 'debug', { value: logManager.debug });
  Object.defineProperty(app, 'info', { value: logManager.info });
  Object.defineProperty(app, 'warn', { value: logManager.warn });
  Object.defineProperty(app, 'log', { value: logManager.log });

  Object.defineProperty(app, 'Moment', { value: Moment });
  Object.defineProperty(app, 'SparkMD5', { value: SparkMD5 });
  Object.defineProperty(app, 'canvasUtils', { value: canvasUtils });
  Object.defineProperty(app, 'format', {
    value: (date, format = 'YYYY-MM-DD HH:mm:ss') => Moment(date).format(format),
  });

  Object.defineProperty(app, 'getCurrentPages', { value: getCurrentPages });
  Object.defineProperty(app, 'hasBootedFromHome', {
    get() {
      const pages = getCurrentPages();
      if (!pages || pages.length === 0) {
        return false;
      }
      return [
        'apps/home/index',
        'apps/mine/index',
        'apps/discover/index',
        'apps/best-choice/index',
      ].includes(pages[0].route);
    },
  });

  /**
   * 定义 Promisify 的 `wx` 对象 `wechat`
   *
   * 增加快捷调用 `toast`、`alert`、`confirm`
   */
  Object.defineProperty(app, 'wechat', {
    value: wechat,
  });
  Object.defineProperty(app, 'toast', {
    value: wechat.toast,
  });
  Object.defineProperty(app, 'alert', {
    value: wechat.alert,
  });
  Object.defineProperty(app, 'confirm', {
    value: wechat.confirm,
  });
  Object.defineProperty(app, 'previewImages', {
    value: wechat.enhancedPreviewImage,
  });
  Object.defineProperty(app, 'saveImages', {
    value: wechat.enhancedSaveImageToPhotosAlbum,
  });
  Object.defineProperty(app, 'navigateTo', {
    value: wechat.enhancedNavigateTo,
  });
  Object.defineProperty(app, 'redirectTo', {
    value: wechat.enhancedRedirectTo,
  });
  Object.defineProperty(app, 'relaunch', {
    value: wechat.enhancedRelaunch,
  });
  Object.defineProperty(app, 'showLoading', {
    get() {
      return (title, mask = true) =>
        wechat.showLoading({
          title,
          mask,
        });
    },
  });
  Object.defineProperty(app, 'hideLoading', {
    value: wechat.hideLoading,
  });
  Object.defineProperty(app, 'openWebappsPage', {
    get() {
      return async (path, extraQuery, events) => {
        const query = {};
        const token = await api.utils.getAuthorizationToken();
        if (token) {
          query.token = token;
        }
        return wechat.enhancedNavigateTo(
          utils.addQueryParameters(`webapps:/${path}`, query),
          extraQuery,
          events || {},
          false
        );
      };
    },
  });

  Object.defineProperty(app, 'checksum', {
    value: (...args) => {
      if (!args || args.length === 0) {
        throw new Error('args must at least one element.');
      }
      const hasher = new SparkMD5();
      const options = Array.isArray(args) ? args : [args];
      options.forEach(arg => {
        if (typeof arg === 'string' && arg) {
          hasher.append(arg);
        } else if (typeof arg === 'number') {
          hasher.append(`${arg}`);
        } else if (typeof arg === 'object') {
          hasher.append(JSON.stringify(arg));
        }
      });
      return hasher.end();
    },
  });

  Object.defineProperty(app, 'utils', {
    value: utils,
  });
  Object.defineProperty(app, 'assetUrl', {
    value: utils.prefixifyAssetsUrl,
  });
  Object.defineProperty(app, 'imageAssetUrl', {
    value: path => utils.prefixifyAssetsUrl(path, true),
  });

  /**
   * 全局环境变量
   */
  Object.defineProperty(app, 'env', {
    value: env,
  });

  /**
   * 接口层
   *
   * ```js
   * const app = getApp();
   *
   * app.api.foundation.listDictionaries(['hospitalOfficeHours']).then(dict => {
   *   // do with data
   * })
   * ```
   */
  Object.defineProperty(app, 'api', {
    get() {
      return api;
    },
  });

  /**
   * 定义接口层 request 函数，仅仅是 `app.api.request` 的别名
   */
  Object.defineProperty(app, 'request', {
    get() {
      return api.request;
    },
  });

  /**
   * 定义上传方法， `app.foundation.upload` 的别名
   */
  Object.defineProperty(app, 'upload', {
    get() {
      return api.foundation.upload;
    },
  });

  /**
   * Redux Actions
   */
  Object.defineProperty(app, 'actions', {
    get() {
      return actions;
    },
  });

  Object.defineProperty(app, 'oauth', {
    get() {
      return actions.oauth;
    },
  });

  /**
   * 获取当前登录用户信息
   *
   * - 若已处理登录状态，则会直接拿到用户信息
   * - 若处于非登录状态，则会尝试自动授权登录，并拿到信息后返回
   * - 自动登录有可能失败
   */
  Object.defineProperty(app, 'getCurrentUser', {
    get() {
      return getAppCurrentUser;
    },
  });

  /**
   * Redux Store
   */
  Object.defineProperty(app, 'store', {
    get() {
      return store;
    },
  });

  /**
   * 全局状态
   */
  Object.defineProperty(app, 'globalState', {
    get() {
      return store.getState();
    },
  });

  Object.defineProperty(app, 'currentUser', {
    get() {
      return store.getState().auth.userInfo;
    },
  });

  /**
   * store.dispatch
   */
  Object.defineProperty(app, 'dispatch', {
    get() {
      return store.dispatch;
    },
  });

  Object.defineProperty(app, 'snap', {
    get() {
      return actions.snap;
    },
  });
  Object.defineProperty(app, 'cache', {
    get() {
      return actions.cache;
    },
  });

  Object.defineProperty(app, 'delay', {
    get() {
      return (seconds = 1) => {
        return new Promise(resolve => {
          setTimeout(resolve, seconds * 1000);
        });
      };
    },
  });

  Object.defineProperty(app, 'generateWebappsUrl', {
    get() {
      return (originalPath, query = {}, withBaseUrl = true) => {
        const [path, search] = originalPath.split('?');
        const existQuery = search
          ? search
              .split('&')
              .map(item => item.split('='))
              .filter(
                ([k, v]) =>
                  // 只添加 key 存在的值
                  !!k &&
                  // 只添加 v 存在的值
                  !!v &&
                  // 删除所有环境变量参数
                  ![
                    'SET_CATX_WEBAPPS_BOOTSTRAP_ENVIRONMENT_DEVELOPMENT',
                    'SET_CATX_WEBAPPS_BOOTSTRAP_ENVIRONMENT_STAGING',
                    'CLEAR_CATX_WEBAPPS_BOOTSTRAP_ENVIRONMENT',
                  ].includes(k)
              )
              .reduce((q, [k, v]) => ({ ...q, [k]: v }), {})
          : {};

        if (env.ENV === 'development') {
          query.SET_CATX_WEBAPPS_BOOTSTRAP_ENVIRONMENT_DEVELOPMENT = true;
        } else if (env.ENV === 'staging') {
          query.SET_CATX_WEBAPPS_BOOTSTRAP_ENVIRONMENT_STAGING = true;
        } else {
          query.CLEAR_CATX_WEBAPPS_BOOTSTRAP_ENVIRONMENT = true;
        }

        query.token = api.utils.getAuthorizationToken() || '';

        return withBaseUrl
          ? utils.addQueryParameters(
              [env.WEBAPPS_BASE_URL, path].join(path.startsWith('/') ? '' : '/'),
              { ...query, ...existQuery }
            )
          : utils.addQueryParameters(path, { ...query, ...existQuery });
      };
    },
  });
}

/**
 * 全局获取用户信息
 *
 * 在使用时候，可以按以下方式获取当前登录用户信息
 *
 * ```js
 * const app = getApp();
 *
 * const user = await app.getCurrentUser()
 *
 * // 或者
 *
 * app.getCurrentUser().then(user => {})
 * ```
 */
async function getAppCurrentUser() {
  let { userInfo } = store.getState().auth;
  if (userInfo) {
    return userInfo;
  }
  const oauthResponse = await actions.oauth();

  if (oauthResponse.userInfo) {
    return oauthResponse.userInfo;
  }
}

/**
 * 设置接口层全局公共错误处理
 */
let globalErrorModalVisible = false;
api.setDefaultErrorHandler(async error => {
  const { code, message, request, response } = error;

  if (env.ENV === 'development') {
    console.group('Default Error');
    console.log('code: ', code);
    console.log('message: ', message);
    console.log('request: ', request);
    console.log('response: ', response);
    console.groupEnd();
  }

  if (['S000010', 'F500', 'F503'].includes(code) || (typeof code === 'number' && code >= 500)) {
    await wechat.showToast({
      title: '系统开小差，请稍后再试哦～',
      icon: 'none',
    });
  } else if (
    ['V000001', 'E400', 'E405', 'E415', 'E404'].includes(code) ||
    (typeof code === 'number' && code >= 400) // code 为 number 类型数据时，表示是 http status code
  ) {
    /**
     * - `V000001`：参数请求错误
     * - `E400`：参数请求错误
     * - `E415`：请求无效
     * - `E404`：资源不存在
     */
    await wechat.showToast({
      title: '无效请求',
      icon: 'none',
    });
  } else if (['E403', 'S0001'].includes(code)) {
    if (globalErrorModalVisible === false) {
      globalErrorModalVisible = true;
      const { confirm } = await wechat.showModal({
        title: '登录失效',
        content: '是否立即重新登录？',
        cancelText: '稍后',
        confirmText: '立即登录',
      });
      globalErrorModalVisible = false;

      if (confirm) {
        wechat.redirectTo({
          url: '/apps/bootstrap/index',
        });
      }
    }
  } else if (typeof code === 'number' && code >= 300) {
    await wechat.showToast({
      title: '系统开小差，请稍后再试哦～',
      icon: 'none',
    });
  } else if (error.message === 'wechat.authorization') {
    if (globalErrorModalVisible === false) {
      globalErrorModalVisible = true;
      const { confirm } = await wechat.showModal({
        title: '微信授权已过期',
        content: '是否立即重新授权？',
        cancelText: '稍后',
        confirmText: '立即授权',
      });
      globalErrorModalVisible = false;

      if (confirm) {
        wechat.redirectTo({
          url: '/apps/oauth/index?navigateBack=true',
        });
      }
    }
  }

  throw error;
});
