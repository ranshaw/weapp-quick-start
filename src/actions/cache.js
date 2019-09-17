import Moment from 'moment';
import { store } from '../store';

const CACHE = '@@CACHE';

const dispatchCache = payload => {
  store.dispatch({
    type: CACHE,
    payload,
  });
};

/**
 * 快照
 *
 * @param {String} key 键
 * @param {Any} data 数据
 * @param {Number} expiresIn 过期时间
 * @param {String} expiresInUnit
 */
export const cache = (key, data, expiresIn = 1, expiresInUnit = 'month') => {
  if (!key) {
    throw new Error(`key required.`);
  }

  const cached = store.getState().cache[key];
  /**
   * 如果 `data` 不存在，则认为是读取流程
   */
  const now = Moment();
  if (data === undefined) {
    if (cached === undefined) {
      return null;
    }

    if (Moment(cached.expireTime).isAfter(now)) {
      return cached.value;
    }

    dispatchCache({
      [key]: undefined,
    });
    return null;
  }

  /**
   * 存储
   */
  const cache = {
    value: data,
    cacheTime: now.toDate(),
    expireTime: now.add(expiresIn, expiresInUnit).toDate(),
  };
  dispatchCache({
    [key]: cache,
  });
};
