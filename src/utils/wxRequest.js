import { constant, env } from './config';
import wxApi from './wxapi';

let host = '';

switch (env) {
  case 'mock':
    host = 'http://localhost:3000';
    break;
  case 'dev':
    host = '';
    break;
  case 'prod':
    host = '';
    break;
  default:
    break;
}

exports.wxRequest = async (url, params = {}, scheme) => {
  // tip.loading()
  console.log('requst请求', JSON.stringify(params));
  let data = params.body || {};
  // wx.showLoading({
  //   title: '加载中...'
  // })
  let res = await wxApi('request', {
    url: requestScheme(scheme, url),
    method: params.method || 'GET',
    data: data,
    header: {
      'Content-Type': 'application/json',
    },
  });
  // wx.hideLoading()
  console.log('返回结果request', res);

  // tip.loaded()
  return filterResponse(res);
};

const requestScheme = (scheme, url) => {
  // if (scheme === 'order') {
  //   return 'http://192.168.1.247:9188' + url
  // }

  // return host + scheme + '_' + env + url;
  return host + url;
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

  return {
    code,
    data,
    message,
  };
};
