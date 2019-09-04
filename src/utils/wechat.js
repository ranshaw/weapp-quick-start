import utils, { addQueryParameters } from './doggy';
import { ENV, WEBAPPS_BASE_URL } from '../env';
// 把普通函数变成promise函数
const promisify = api => {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      api(
        Object.assign({}, options, {
          success: resolve,
          fail: reject,
        }),
        ...params
      );
      // Promise.prototype.finally = function(callback) {
      //   let P = this.constructor;
      //   return this.then(
      //     value => P.resolve(callback()).then(() => value),
      //     reason =>
      //       P.resolve(callback()).then(() => {
      //         throw reason;
      //       })
      //   );
      // };
    });
  };
};

const wechat = {};

for (let key in wx) {
  if (
    (/^on|^create|Sync$|Manager$|^pause/.test(key) && key !== 'createBLEConnection') ||
    key === 'stopRecord' ||
    key === 'stopVoice' ||
    key === 'stopBackgroundAudio' ||
    key === 'stopPullDownRefresh' ||
    key === 'hideKeyboard' ||
    key === 'hideToast' ||
    key === 'hideLoading' ||
    key === 'showNavigationBarLoading' ||
    key === 'hideNavigationBarLoading' ||
    key === 'canIUse' ||
    key === 'navigateBack' ||
    key === 'closeSocket' ||
    key === 'closeSocket' ||
    key === 'pageScrollTo' ||
    key === 'drawCanvas' ||
    key === 'env'
  ) {
    wechat[key] = wx[key];
  } else {
    wechat[key] = promisify(wx[key]);
  }
}

Object.defineProperty(wechat, 'match', {
  get() {
    return (type, str) => {
      let reg = '';
      if (type === 'chinese') {
        // 匹配中文字符
        reg = /[\u4e00-\u9fa5]/gm;
      } else if (type === 'email') {
        // 匹配email地址
        reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      } else if (type === 'url') {
        // 匹配URL地址
        reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
      } else if (type === 'phoneNumber') {
        // 匹配手机号码
        reg = /^(0|86|17951)?(13[0-9]|14[579]|15[012356789]|166|17[1235678]|18[0-9]|19[189])\s{0,1}[0-9]{4}\s{0,1}[0-9]{4}$/;
      } else if (type === 'cardid') {
        // 匹配身份证号
        reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
      } else if (type === 'mail') {
        // 匹配邮编号
        reg = /^[1-9]\d{5}(?!\d)$/;
      }
      if (reg.test(str)) {
        return true;
      } else {
        return false;
      }
    };
  },
});

Object.defineProperty(wechat, 'toast', { value: toast });
Object.defineProperty(wechat, 'alert', { value: alert });
Object.defineProperty(wechat, 'confirm', { value: confirm });
Object.defineProperty(wechat, 'enhancedPreviewImage', { value: enhancedPreviewImage });
Object.defineProperty(wechat, 'enhancedNavigateTo', { value: enhancedNavigateTo });
Object.defineProperty(wechat, 'enhancedRedirectTo', { value: enhancedRedirectTo });
Object.defineProperty(wechat, 'enhancedRelaunch', { value: enhancedRelaunch });
Object.defineProperty(wechat, 'enhancedSaveImageToPhotosAlbum', {
  value: enhancedSaveImageToPhotosAlbum,
});

function parseUrl(originalUrl) {
  if (originalUrl.startsWith('webapps://')) {
    const [path, search] = originalUrl.replace('webapps:/', '').split('?');
    const query = search
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

    if (ENV === 'development') {
      query.SET_CATX_WEBAPPS_BOOTSTRAP_ENVIRONMENT_DEVELOPMENT = true;
    } else if (ENV === 'staging') {
      query.SET_CATX_WEBAPPS_BOOTSTRAP_ENVIRONMENT_STAGING = true;
    } else {
      query.CLEAR_CATX_WEBAPPS_BOOTSTRAP_ENVIRONMENT = true;
    }

    const url = addQueryParameters(
      wechat.match('url', path)
        ? path
        : [WEBAPPS_BASE_URL, path].join(path.startsWith('/') ? '' : '/'),
      query
    );
    return addQueryParameters('/apps/core/browser/index', {
      url,
    });
  } else if (originalUrl.startsWith('mini-program://')) {
    return originalUrl.replace('mini-program:/', '');
  }
  return originalUrl;
}

function enhancedNavigateTo(route, query, events) {
  if (typeof route === 'object') {
    return wechat.navigateTo({
      ...route,
      url: addQueryParameters(parseUrl(route.url), query || {}),
    });
  } else {
    const url = addQueryParameters(parseUrl(route), query || {});
    return wechat.navigateTo({
      url,
      events,
    });
  }
}

function enhancedRedirectTo(route, query) {
  if (typeof route === 'object') {
    return wechat.redirectTo(route);
  } else {
    const url = addQueryParameters(route, query);
    return wechat.redirectTo({
      url,
    });
  }
}

function enhancedRelaunch(route = '', query = {}) {
  if (route && typeof route === 'object') {
    return wechat.reLaunch(route);
  } else {
    const url = addQueryParameters(route || '/apps/home/index', query);
    return wechat.reLaunch({
      url,
    });
  }
}

async function enhancedSaveImageToPhotosAlbum(filePath) {
  const { authSetting } = await wechat.getSetting();

  if (
    !authSetting.hasOwnProperty('scope.writePhotosAlbum') ||
    !authSetting['scope.writePhotosAlbum']
  ) {
    // 若没有授权，则申请用户授权
    try {
      await wechat.authorize({
        scope: 'scope.writePhotosAlbum',
      });
    } catch ({ errMsg }) {
      if (errMsg === 'authorize:fail auth deny') {
        throw new Error('authorize:fail auth deny');
      }

      if (errMsg.startsWith('authorize:fail') && errMsg.endsWith('-12006,auth deny')) {
        throw new Error('authorize:fail auth deny');
      }
    }
  }

  // 支持批量保存
  if (Array.isArray(filePath)) {
    return Promise.all(filePath.map(path => enhancedSaveImageToPhotosAlbum(path))).then(results =>
      results.map((item, index) => {
        return {
          filePath: filePath[index],
          success: item && item.errMsg === 'saveImageToPhotosAlbum:ok',
          errMsg: item && item.errMsg ? item.errMsg : '',
          result: item,
        };
      })
    );
  }
  // 兼容微信官方参数
  let path = typeof filePath === 'string' ? filePath : filePath.filePath;

  // 兼容 url 地址
  if (wechat.match('url', path)) {
    const { tempFilePath } = await wechat.downloadFile({ url: path });

    path = tempFilePath;
  } else if (path.startsWith('data:') && path.indexOf(';base64,') !== -1) {
    const ext = path.split(';base64,')[0].split('/')[1];
    const data = path.slice(path.indexOf('base64,') + 7);
    path = `${wechat.env.USER_DATA_PATH}/${utils.uniqueId()}.${ext}`;

    try {
      await new Promise((resolve, reject) => {
        wechat.getFileSystemManager().writeFile({
          filePath: path,
          data,
          encoding: 'base64',
          success: async res => {
            resolve(res);
          },
          fail: res => {
            reject(res);
          },
        });
      });
    } catch (error) {
      return null;
    }
  }

  const saved = await wechat.saveImageToPhotosAlbum({
    filePath: path,
  });

  return saved;
}

/**
 * Toast 提示
 *
 * 该函数只是对 `wx.showToast` 的封装，将 `title`、`duration` 两个最
 * 常使用的参数提取到函数形参中，其它配置通过第三个 `options` 参数中，若
 * `options.icon` 配置不存在，则默认使用 `none`
 *
 * @param {String} message Toast 消息
 * @param {Number} duration 展示时长
 * @param {String} icon 图标类型
 * @param {Object} options 扩展配置
 */
async function toast(message, duration = 1500, options = {}) {
  const mergedOptions = utils.merge(
    {
      icon: 'none',
    },
    options
  );
  return wechat.showToast({
    ...mergedOptions,
    title: `${message || ''}`,
    duration,
  });
}

async function alert(message, title = '提示', confirmText = '我知道了', options = {}) {
  return await wechat.showModal({
    ...options,
    title,
    confirmText,
    content: `${message || ''}`,
    showCancel: false,
  });
}

async function confirm(message, title = '提示', options = {}) {
  const mergedOptions = utils.merge(
    {
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#2e2e2e',
      confirmText: '确定',
      confirmColor: '#576B95',
    },
    options,
    {
      title,
      content: `${message || ''}`,
    }
  );

  const { confirm } = await wechat.showModal(mergedOptions);

  if (confirm) {
    return true;
  }
  return false;
}

function enhancedPreviewImage(images, current = 0) {
  if (typeof images === 'string') return wechat.previewImage({ urls: [images] });

  const imageArray = Array.isArray(images) ? images : [images];

  if (imageArray.length === 0) {
    return;
  }

  const currentImage = imageArray.length - 1 > current ? imageArray[current] || '' : '';

  const urls = imageArray
    .map(image => (typeof image === 'object' ? image.url : image))
    .filter(url => typeof url === 'string' && url);

  return wechat.previewImage({
    urls,
    current: typeof currentImage === 'object' ? currentImage.url : currentImage,
  });
}

export default wechat;
