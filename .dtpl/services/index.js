import { wxRequest } from '/utils/wxRequest';
import { api, constant } from '/utils/config';

exports.navList = async params => {
  const ret = await wxRequest(
    api.index.users,
    {
      method: 'GET',
      body: JSON.stringify(params),
    },
    'prod'
  );
  // if (ret.code === constant.codeSuccess) {
  //   const { name, id, children } = ret.data;
  //   // 过滤无用数据
  //   return Object.assign(ret, {
  //     data: {
  //       name,
  //       id,
  //       children,
  //     },
  //   });
  // }
  return ret;
};
