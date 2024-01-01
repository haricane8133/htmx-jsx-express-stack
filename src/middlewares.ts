import { get as _get, isEmpty as _isEmpty } from 'lodash';
import type { RequestHandler } from 'express';

import { constants } from './constants';
import * as auth from './auth';

export const middlewareRemovePoweredBy: RequestHandler = (req, res, next) => {
  res.removeHeader('X-Powered-By');
  next();
};

export const loginCookieChecker: RequestHandler = async (req, res, next) => {
  const cookie = auth.getLoginCookie(req);
  if (_isEmpty(cookie) || typeof cookie !== 'object') {
    res.redirect(`${constants.contextPath}/login`);
    return;
  }
  if (
    !(await auth.checkLogin(
      _get(cookie, 'userid'),
      _get(cookie, 'password'),
      _get(cookie, 'time'),
    ))
  ) {
    res.redirect(`${constants.contextPath}/403`);
    return;
  }
  res.locals.userid = _get(cookie, 'userid');
  next();
};
