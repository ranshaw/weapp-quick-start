const wxApi = (api, params = {}) => {
  return new Promise((resolve, reject) => {
    wx[api](
      Object.assign(
        {
          success: res => {
            resolve(res);
          },
          fail: res => {
            reject(res);
          },
        },
        params
      )
    );
  });
};
export default wxApi;
