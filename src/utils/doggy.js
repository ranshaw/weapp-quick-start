import UrlTemplate from './UrlTemplate';

import { ALIYUN_OSS_IMAGE_ASSETS_BASE_URL, ASSETS_BASE_URL } from '../env';

const DURATION_AGO = 'ago';
const DURATION_IN = 'in';

const DATETIME_UNITS = [
  ['MILLISECONDS', 1],
  ['SECONDS', 1000],
  ['MINUTES', 60],
  ['HOURS', 60],
  ['DAYS', 24],
  ['WEEKS', 7],
  ['MONTHS', 4],
  ['YEARS', 12],
];

const DATETIME_LOCALES_ZH = {
  milliseconds: '毫秒',
  seconds: '秒',
  minutes: '分钟',
  hours: '小时',
  days: '天',
  weeks: '周',
  months: '个月',
  years: '年',
  millisecond: '毫秒',
  second: '秒',
  minute: '分钟',
  hour: '小时',
  day: '天',
  week: '周',
  month: '个月',
  year: '年',
  in: '将在',
  ago: '以前',
};

/**
 * 为图片资源路径添加前缀
 *
 * @param {String} path 图片路径
 */
function prefixifyAssetsUrl(path, image = false) {
  if (image) {
    return [ALIYUN_OSS_IMAGE_ASSETS_BASE_URL, path].join(path.startsWith('/') ? '' : '/');
  }
  return [ASSETS_BASE_URL, path].join(path.startsWith('/') ? '' : '/');
}

function addQueryParameters(url, parameters = {}) {
  const separator = /\?/.test(url) ? '&' : '?';
  const names = Object.keys(parameters);

  if (names.length === 0) {
    return url;
  }

  const query = names
    .filter(name => typeof parameters[name] === 'number' || parameters[name])
    .map(name => `${name}=${encodeURIComponent(parameters[name])}`)
    .join('&');

  return `${url}${separator}${query}`;
}

function eachCall(object, fn) {
  if (object === null || typeof object === 'undefined') {
    return;
  }

  const reassigned = typeof object !== 'object' ? [object] : object;

  if (Array.isArray(reassigned)) {
    for (let i = 0, l = object.length; i < l; i += 1) {
      fn(reassigned[i], i, reassigned);
    }
  } else {
    for (let key in reassigned) {
      if (Object.prototype.hasOwnProperty.call(reassigned, key)) {
        fn(reassigned[key], key, reassigned);
      }
    }
  }
}

function lowercaseKeys(object) {
  return !object
    ? {}
    : Object.keys(object).reduce(
        (newObj, key) => ({
          ...newObj,
          [key.toLowerCase()]: object[key],
        }),
        {}
      );
}

/**
 * 将多个对象合并成一个对象
 *
 * @param objects object[]
 */
function merge(...objects) {
  const merged = {};

  const assignValue = (value, key) => {
    if (typeof merged[key] === 'object' && typeof value === 'object') {
      merged[key] = merge(merged[key], value);
    } else {
      merged[key] = value;
    }
  };

  for (let i = 0, l = objects.length; i < l; i += 1) {
    eachCall(objects[i], assignValue);
  }

  return merged;
}

/**
 * 将 sort 转为字符串
 *
 * `-foobar,+foo,-bar`
 *
 * ```js
 * const sort = {
 *   createTIme: '-', // 降序
 *   endTime: '+', // 升序
 *   price: 'desc', // 降序
 *   salePrice: 'asc', // 升序
 * }
 * ```
 *
 * @param sort {field: 'FIELD_NAME', sort: 'asc'}
 */
function stringifySort(sort) {
  return Object.keys(sort)
    .map(key => {
      let order = sort[key] === '+' || sort[key] === 'asc' ? '+' : '-';
      return `${order}${key}`;
    })
    .join(',');
}

/**
 * 格式化 Endpoint
 *
 * Endpoint 格式如下
 *
 * ```js
 * // 查询特定门店下某一个商品条目
 * const endpoint = 'GET /stores/{storeId}/items/{itemId}'
 *
 * const params = {storeId: 1, itemId: 2}
 *
 * const query = {ref: 'app'}
 *
 * const formatted = formatEndpoint(endpoint, {params, query, baseUrl: 'https://api.chongaitianxia.cn/api'})
 *
 * console.log(formatted.url) // 输出：`https://api.chongaitianxia.cn/api/stores/1/items/2?ref=app`
 * ```
 *
 * 关于公司 RESTful 接口请求规范
 *
 * 1. 接口的操作使用 `HTTP METHOD` 动词，表示：我需要对资源进行什么操作，公司现在使用的有：
 *    - `GET`：获取指定资源（`SELECT`、`QUERY`）
 *    - `POST`：创建一个新的资源（`CREATE`），或者对某一个指定资源进行操作，比如对 `Order` 进行支付 (`Pay`) 操作
 *    - `PUT`：更新已有资源，（`UPDATE`）
 *    - `DELETE`：删除已有资源（`DELETE`，`REMOVE`，`DESTROY`）
 * 2. 对于 `GET` ，只用于获取资源，幂等的，不管进行多少次操作，都不会对资源产生影响
 * 3. 对于 `DELETE`，删除资源，虽然有副作用，但也应该要满足幂等，多次调用的结果应该是完全一致的
 * 4. 对于 `POST`，将资源提交给接收者，比如常见的，创建一个新订单，即将一个订单数据提交给订单数据集（接收者）
 * 5. 对于 `PUT`，是对资源自己进行操作，此时，应该是幂等的，即同样的操作，不管调用多少次，结果应该是一致的
 *
 * ENDPOINT 结构
 *
 * 一个资源节点，由两部分组成：`METHOD /PATH/TO/RESOURCE`，其中 `METHOD` 表示资源的请求方式，空格之后部分表示资源的路径
 * 资源路径可以是完整的 URL 地址，也可以是URL PATH，
 *
 * ```js
 * const STORE_GOODS_ENDPOINT = 'GET /store-service/stores/{storeId}/goods'
 * ```
 *
 * 上面的 `STORE_GOODS_ENDPOINT` 节点，表示，
 *
 * - 我的请求方式是 `GET`，你不管调用多少次都不会对我产生影响
 * - 我的路径是 `/store-service/stores/{storeId}/goods`
 * - 当你真的请求我的时候，还需要提供一个变量 `storeId`，以表示你是需要查询哪家门店的商品
 * - 如果你需要进行排序，过滤，筛选，那么，使用 `querystring`，比如 `?pageSize=20&pageNum=2&keywords=宠爱&sortParam=-createTime`
 *
 * `endpoint` 函数的作用即创建符合 `RESTful` 规范的 `URL` 地址，用于前后端通信，
 *
 * `options` 参数中提供如下四个数据：
 *
 * - `params`：一个对象，保存 `endpoint` 定义中对应变量的值
 * - `query`：一个对象，保存用于 `querystring` 查询的值
 * - `sort`：一个对象，保存排序值（排序方式见：https://note.youdao.com/ynoteshare1/index.html?id=bba69005044328de464a8e6bdabb973d&type=note）
 * - `baseUrl`：一个字符串，最终生成的URL地址会被附加在该地址之后
 *
 * 具体使用方式见：[__tests__/formatters.test.ts](__tests__/formatters.test.ts)
 *
 * @param endpoint  Endpoint
 * @param options 格式化选项
 */
function endpoint(endpoint, options) {
  const [method, ...paths] = endpoint.split(' ');

  const params = options ? options.params : null;
  const query = options ? options.query : null;
  const sort = options ? options.sort : null;
  const baseUrl = options ? options.baseUrl : '';
  let url = [baseUrl || '', ...paths].join('');

  // 如果有 params，则将 params 填充进
  if (params && typeof params === 'object') {
    url = UrlTemplate.expandTemplate(url, params);
  }

  const queries = sort
    ? merge(query, {
        sortParam: typeof sort === 'string' ? sort : stringifySort(sort),
      })
    : query;

  if (queries && typeof queries === 'object') {
    url = addQueryParameters(url, queries);
  }

  return {
    method: method.toUpperCase(),
    url,
  };
}

function uniqueId(length, radix) {
  if (radix === void 0) {
    radix = 16;
  }
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const segments = [];
  if (length === undefined) {
    segments[8] = segments[13] = segments[18] = segments[23] = '-';
    segments[14] = '4';
    for (let i = 0; i < 36; i += 1) {
      if (segments[i] === undefined) {
        let r = 0 | (Math.random() * 16);
        segments[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  } else {
    for (let i = 0; i < length; i += 1) {
      segments[i] = chars[0 | (Math.random() * radix)];
    }
  }
  return segments.join('');
}

function isDigit(input) {
  return /^[0-9]+$/.test(input);
}

function toInteger(input) {
  try {
    return parseInt(input);
  } catch (_) {
    return input;
  }
}

function toDate(input) {
  if (input instanceof Date) {
    return input;
  }
  if (!isNaN(input) || isDigit(input)) {
    const unix = toInteger(input) * (input.length === 10 ? 1000 : 1);
    return new Date(unix);
  }
  const time = (input || '')
    .trim()
    .replace(/\.\d+/, '') // remove milliseconds
    .replace(/-/, '/')
    .replace(/-/, '/')
    .replace(/(\d)T(\d)/, '$1 $2')
    .replace(/Z/, ' UTC') // 2017-2-5T3:57:52Z -> 2017-2-5 3:57:52UTC
    .replace(/([+-]\d\d):?(\d\d)/, ' $1$2'); // -04:00 -> -0400
  return new Date(time);
}

/**
 * 得到时间区间的间隔描述
 *
 * @param comparison datetime
 * @param datum datetime
 */
function duration(comparison, datum, format, locale = 'zh') {
  const locales = locale === 'zh' ? DATETIME_LOCALES_ZH : DATETIME_LOCALES_ZH;
  // 比较时间点
  const comparisonDate = toDate(comparison);
  // 基准时间点
  const datumDate = toDate(datum || new Date());
  // 间隔毫秒数
  const milliseconds = comparisonDate.valueOf() - datumDate.valueOf();
  // Ago or In
  const agoOrIn = milliseconds < 0 ? DURATION_AGO : DURATION_IN;
  const uncalculatedUnits = DATETIME_UNITS.slice();
  const result = {
    kind: agoOrIn,
    milliseconds: 0,
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
    weeks: 0,
    months: 0,
    years: 0,
    formatted: '',
  };
  let uncalculatedMilliseconds = Math.abs(milliseconds);
  let maxUnit;
  while (uncalculatedMilliseconds > 0 && uncalculatedUnits.length > 0) {
    var rates = uncalculatedUnits
      .map(function(unit) {
        return unit[1];
      })
      .reduce(function(a, b) {
        return a * b;
      }, 1);
    const unit = uncalculatedUnits.pop();
    if (unit === undefined) {
      break;
    }
    const value = Math.floor(uncalculatedMilliseconds / rates);
    if (value > 0) {
      result[unit[0].toLowerCase()] = value;
      if (!maxUnit) {
        maxUnit = [value, unit[0].toLowerCase()];
      }
    }
    uncalculatedMilliseconds -= rates * value;
  }
  const resultFormat = format || agoOrIn === 'ago' ? '%v%u%a' : '%a%v%u';
  if (resultFormat !== undefined && Array.isArray(maxUnit)) {
    const unitLabel = locales[maxUnit[1]] || maxUnit[1];

    if (locale === 'zh') {
      const agoOrInLabel = agoOrIn === 'in' ? '后' : '前';
      result.formatted = resultFormat
        .replace('%v', maxUnit[0].toString())
        .replace('%u', unitLabel)
        .replace('%a', agoOrInLabel);
    } else {
      result.formatted = resultFormat
        .replace('%v', maxUnit[0].toString())
        .replace('%u', maxUnit[1])
        .replace('%a', agoOrIn);
    }

    result.magic = [agoOrIn, maxUnit[1], maxUnit[0]];
    result.locale = locale;
    result.locales = locales;
  }
  return result;
}

function throttle(fn, wait = 250) {
  let pending = false;
  let isAsyncFn = Object.toString.call(fn) === '[object AsyncFunction]';
  let result;

  const delay = () => {
    setTimeout(() => {
      pending = false;
    }, wait);
  };

  function throttled(...args) {
    if (pending) {
      return isAsyncFn ? Promise.resolve(result) : result;
    }

    pending = true;

    if (isAsyncFn) {
      return fn.call(this, ...args).then(ret => {
        result = ret;
        delay();
        return ret;
      });
    }
    result = fn.call(this, ...args);
    delay();
    return result;
  }

  return throttled;
}

export {
  prefixifyAssetsUrl,
  addQueryParameters,
  duration,
  eachCall,
  endpoint,
  lowercaseKeys,
  merge,
  stringifySort,
  toDate,
  toInteger,
  uniqueId,
  throttle,
};

export default {
  prefixifyAssetsUrl,
  addQueryParameters,
  duration,
  eachCall,
  endpoint,
  lowercaseKeys,
  merge,
  stringifySort,
  toDate,
  toInteger,
  uniqueId,
  throttle,
};
