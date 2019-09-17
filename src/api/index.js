import * as auth from './auth';
import * as utils from './utils';
import request, { setDefaultErrorHandler } from './request';

export { utils, setDefaultErrorHandler, request, auth };

export default {
  utils,
  setDefaultErrorHandler,
  request,
  auth,
};
