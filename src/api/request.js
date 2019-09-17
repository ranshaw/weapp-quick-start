import wechat from '/utils/wechat';
import doggy from '/utils/doggy';
import { API_BASE_URL } from '../env';

import { OK } from './constants';
import { getAuthorizationToken, isValidHttpMethod } from './utils';

let defaultErrorHandler;
export class BadHttpMethodError extends Error {
  constructor(method) {
    const message = `[${method}] is not a valid http method in `;
    super(message);
    this.name = 'BadHttpMethodError';
  }
}

export class ApiAuthorizationError extends Error {
  constructor(message = 'authorization required') {
    super(message);
    this.name = 'ApiAuthorizationError';
  }
}

export class ApiError extends Error {
  constructor(message = 'api error', code, requestConfig, response) {
    super(message);
    this.message = message;
    this.name = 'ApiError';
    this.code = code;
    this.request = requestConfig;
    this.response = response;
  }
}

const defaultRequestConfig = {
  url: '',
  header: {},
  dataType: 'json',
  responseType: 'text',
};

/**
 * 请求后端接口
 *
 * @param requestConfig 请求配置
 *
 * ```js
 * const config = {
 *    data?: AnyObject;
 *    baseUrl?: string;
 *    sort?: { [field: string]: string };
 *    query?: AnyObject;
 *    params?: AnyObject;
 *    header?: AnyObject;
 *    method?: HttpMethod;
 *    dataType?: string;
 *    responseType?: "text" | "arraybuffer";
 *    authorizationRequired?: boolean;
 * }
 * ```
 */
export const request = async (endpoint, config) => {
  const {
    data,
    baseUrl,
    sort,
    query,
    params,
    header,
    method,
    dataType,
    responseType,
    authorizationRequired,
  } = doggy.merge(defaultRequestConfig, config);

  const formattedEndpoint = doggy.endpoint(endpoint, {
    params,
    query,
    sort,
    baseUrl: baseUrl || API_BASE_URL,
  });

  if (
    !isValidHttpMethod(formattedEndpoint.method) ||
    (method && method.toUpperCase() !== formattedEndpoint.method)
  ) {
    throw new BadHttpMethodError(`${formattedEndpoint.method} not allowed`);
  }

  const requestConfig = {
    url: formattedEndpoint.url,
    method: formattedEndpoint.method,
    header: doggy.merge({}, header),
    dataType: dataType || 'json',
    responseType: responseType || 'json',
  };

  if (['POST', 'PUT', 'PATCH', 'BATCH'].includes(`${requestConfig.method}`) && data) {
    requestConfig.data = data;
  }

  // 将 header 对象所有键改为 纯小写
  requestConfig.header = doggy.lowercaseKeys(requestConfig.header || {});

  // `authorizationRequired !== false`，表示当前请求需要登录状态下才能访问
  if (authorizationRequired !== false && !requestConfig.header.token) {
    // 获取 Token
    const token = await getAuthorizationToken();

    // 若 Token 不存在，
    // if (!token) {
    //   throw new ApiAuthorizationError('token not exist');
    // }

    requestConfig.header.token = token;
  }

  const { data: payload, statusCode, header: responseHeader } = await wechat.request(requestConfig);

  if (statusCode >= 300) {
    const error = new ApiError(statusCode, statusCode, requestConfig, {
      payload,
      statusCode,
      header: responseHeader,
    });
    if (defaultErrorHandler) {
      return defaultErrorHandler(error);
    }
    throw error;
  }

  const { data: responseData, code, message } = payload;

  // 若请求不 OK，则报错
  if (code !== OK) {
    if (defaultErrorHandler) {
      return defaultErrorHandler(new ApiError(message, code, requestConfig, responseData));
    }
    throw new ApiError(message, code, requestConfig, responseData);
  }

  /**
   * 判断是否是分类查询接口
   *
   * 条件：
   *
   * 1. 请求方式为 `GET`
   * 2. 请求响应结构完全符合
   *
   *    ```js
   *    {
   *        list: [], // list 字段一定是个数组
   *        pageCount: 0, // 页码总数为数字
   *        pageNum: 0, // 当前页码为数字
   *        pageSize: 0, // 每页数量
   *        total: 0, // 总条目数
   *    }
   *    ```
   */
  if (
    Array.isArray(responseData.list) &&
    typeof responseData.pageCount === 'number' &&
    typeof responseData.pageNum === 'number' &&
    typeof responseData.pageSize === 'number' &&
    typeof responseData.total === 'number'
  ) {
    const {
      list: items,
      pageCount,
      pageNum: currentPage,
      pageSize: itemsPerPage,
      total: itemCount,
    } = responseData;

    const hasMore = pageCount > currentPage;
    const nextPage = currentPage + 1;
    return {
      items,
      pagination: {
        pageCount, // 总页码数
        currentPage, // 当前页码
        itemsPerPage, // 每一页条目限制数量
        itemCount, // 总条目数
        hasMore, // 是否还有更多数据
        nextPage, // 下一页页码

        // 兼容 ant.design pagination 对象
        current: currentPage,
        pageSize: itemsPerPage,
        total: itemCount,

        // 兼容 Semantic-UI
        totalPages: pageCount,
        defaultActivePage: currentPage,
      },
      nextQuery: {
        pageNum: nextPage,
        pageSize: itemsPerPage,
      },
    };
  }

  // 请求成功，返回结果
  return responseData;
};

export function setDefaultErrorHandler(handler) {
  if (typeof handler === 'function') {
    defaultErrorHandler = error => handler(error);
  }
}

export default request;
