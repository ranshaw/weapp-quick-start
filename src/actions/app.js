import { store } from '../store';

export const LAUNCH = 'LAUNCH';

/**
 * 启动App，更新启动参数
 *
 * @param {Object} payload 启动参数
 */
export const launch = payload => {
  store.dispatch({
    type: LAUNCH,
    payload,
  });
};
