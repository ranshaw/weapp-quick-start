import { store } from '../store';
import { merge } from '/utils/doggy';

const SNAP = '@@SNAP';

const dispatchSnap = payload => {
  store.dispatch({
    type: SNAP,
    payload,
  });
};

/**
 * 快照
 *
 * @param {String} key 键
 * @param {Any} data 数据
 * @param {Boolean} once 是否只能被读取一次
 * @param {Object} options 配置
 */
export const snap = (key, data, once = true, options = { overwrite: false }) => {
  if (!key) {
    throw new Error(`key required.`);
  }

  const snapped = store.getState().snap[key];
  /**
   * 如果 `data` 不存在，则认为是读取流程
   */
  if (data === undefined) {
    if (snapped === undefined) {
      throw new Error(`snapshot for key "${key}" not exists.`);
    }

    const { value, once } = snapped;

    if (once) {
      dispatchSnap({ [key]: undefined });
    }

    return value;
  }

  /**
   * 存储
   */
  const mergedOptions = merge(
    {
      overwrite: false,
    },
    options
  );

  if (snapped !== undefined && snapped.options.overwrite !== true) {
    throw new Error(`unoverwritable snapshot for key "${key}" exist.`);
  }
  const shot = { value: data, once, options: mergedOptions };
  dispatchSnap({
    [key]: shot,
  });
};
