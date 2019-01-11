import { wxRequest } from '../../../utils/wxRequest';
import { codeSuccess } from '../../../utils/constant';

exports.navList = async params => {
  const ret = await wxRequest(
    '/api/users',
    {
      method: 'GET',
      body: JSON.stringify(params),
    },
    'prod'
  );
  if (ret.code === codeSuccess) {
    const { name, id, children } = ret.data;
    // 过滤无用数据
    return Object.assign(ret, {
      data: {
        name,
        id,
        children,
      },
    });
  }
  return ret;
};
