import { codeSuccess } from './constant';
import wxApi from './wxapi';
// const env = 'prod'// uat
const env = 'uat';

const host = 'http://localhost:3000';
// const host = 'http://192.168.1.32:9188'

// if (env === 'prd') {
//   host = 'https://wxprogram.lybrc.com.cn/liwu/'
// } else if (env === 'test') {
//   host = 'https://wxprogram.lybrc.com.cn/liwu/'
// }

exports.wxRequest = async (url, params = {}, scheme) => {
  // tip.loading()
  console.log('requst请求', JSON.stringify(params));
  let data = params.body || {};
  // wx.showLoading({
  //   title: '加载中...'
  // })
  let res = await wxApi('request', {
    url: requestScheme(scheme, url),
    // url: 'http://192.168.1.86:9177' + url,
    method: params.method || 'GET',
    data: data,
    header: {
      'Content-Type': 'application/json',
      // token: wepy.$instance.globalData.token,
      // token: await wepy.getStorage({ key: 'token' }).then(v => v.data),
      // token: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MzM0NTIzMDgsImp0aSI6Imp3dCIsImlhdCI6MTUzMDg2MDMwOCwic3ViIjoie1xuICBcImxvZ2luSWRcIiA6IFwiMTAxNDA5ODIyMjIyNDg1NTA0MlwiLFxuICBcIm5hbWVcIiA6IFwiXCIsXG4gIFwib3BlbklkXCIgOiBcIm9DTFVHMFgwXy01Mk14SVQxMnJrUkdJMzcwWHNcIixcbiAgXCJzZXNzaW9uS2V5XCIgOiBcIm84RFRycFN3Zkp6RzJ2UEZTZzg0bEE9PVwiXG59In0.kHd2AFawUt4vpZjM4YoPBD4Ugt3JCUXeMko2aPc6aV4'
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

  if (code !== codeSuccess) {
    if (message.trim().length > 7) {
      // wepy.showToast({
      //   title: message,
      //   icon: 'none',
      // });
    } else {
      // wepy.showToast({
      //   title: message,
      //   image: '/assets/images/failicon.png',
      // });
    }
  }

  return {
    code,
    data,
    message,
  };
};
