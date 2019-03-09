import { constant, env } from './config';
import wxApi from './wxapi';
import { emitter } from './create';

let host = '';

switch (env) {
  case 'mock':
    host = 'http://localhost:3000';
    break;
  case 'dev':
    host = 'http://118.31.37.206:9320';
    break;
  case 'prod':
    host = '';
    break;
  default:
    break;
}

exports.wxRequest = async (url, params = {}, scheme) => {
  console.log('requst请求', JSON.stringify(params));
  let data = params.body || {};

  emitter.emit('showLoading', true);
  let res = await wxApi('request', {
    url: requestScheme(scheme, url),
    method: params.method || 'GET',
    data: data,
    header: {
      'Content-Type': 'application/json',
      token: wx.getStorageSync('token'),
    },
  });
  console.log('返回结果request', res);
  emitter.emit('showLoading', false);
  return filterResponse(res);
};

const requestScheme = (scheme, url) => {
  if (scheme === 'mock') {
    return 'http://localhost:3000' + url;
  } else {
    return host + url;
  }

  // return host + scheme + '_' + env + url;
};
exports.requestScheme = requestScheme;

const filterResponse = res => {
  let { code, data, message } = res.data;

  switch (code) {
    case 'S0001':
      message = '请重新登入';
      break;
    default:
  }

  if (code !== constant.codeSuccess) {
    wx.showToast({
      title: message,
      icon: 'none',
    });
  }

  if (code === 'S0001') {
    wx.reLaunch({
      url: '/page/loading/index',
    });
  }

  return {
    code,
    data,
    message,
  };
};
