import request from './request';
export const GET_CURRENT_USER_INFO = 'POST /saas-consumer-user-user-service/getUserInfo';

/**
 * 获取当前登录用户信息
 */
export async function getCurrentUserInfo() {
  const userInfo = await request(GET_CURRENT_USER_INFO);

  return userInfo;
}
