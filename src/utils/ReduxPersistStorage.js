import wechat from '/utils/wechat';

const createStorage = keyPrefix => {
  return {
    getItem: key =>
      wechat
        .getStorage({
          key: `${keyPrefix}${key}`,
        })
        .then(({ data }) => data),
    setItem: (key, data) =>
      wechat.setStorage({
        key: `${keyPrefix}${key}`,
        data,
      }),
    removeItem: key =>
      wechat.removeStorage({
        key: `${keyPrefix}${key}`,
      }),
  };
};

export { createStorage };

export default {
  createStorage,
};
