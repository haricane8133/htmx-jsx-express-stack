import path from 'path';

import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { get as _get, isEmpty as _isEmpty } from 'lodash';
// import cors from 'cors';
import bodyParser from 'body-parser';

import * as auth from './auth';
import * as htmx from './htmx';
import { constants } from './constants';
import { loginCookieChecker } from './middlewares';

const router = express.Router();
router.use(morgan('tiny'));
router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
// router.use(cors());
router.use(helmet());

router.get('/', (req, res) => {
  res.redirect(`${constants.contextPath}/dashboard`);
});

router.get('/dashboard', loginCookieChecker, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.post('/api/login.action', async (req, res) => {
  const userid = _get(req, 'body.userid');
  const password = _get(req, 'body.password');
  const passHash = auth.hash(password);
  if (!(await auth.checkLogin(userid, passHash))) {
    res.clearCookie(constants.loginCookieName);
    res.send(htmx.getUnauthorized());
    return;
  }
  auth.setLoginCookie(res, userid, passHash);
  res.send(htmx.getSuccessLogin());
});

router.get('/api/logout.action', async (req, res) => {
  res.clearCookie(constants.loginCookieName);
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/create.html'));
});

router.post('/api/create.action', async (req, res) => {
  const userid = _get(req, 'body.userid');
  const password = _get(req, 'body.password');
  const passwordRepeat = _get(req, 'body.password-repeat');

  if (_isEmpty(userid) || _isEmpty(password) || _isEmpty(passwordRepeat)) {
    res.send('<h4>Fields cannot be empty</h4>');
    return;
  }
  if (password.length > 30) {
    res.send('<h4>Please have password less than 30 characters</h4>');
    return;
  }

  if (!constants.PILOT_LOGIN.includes(constants.ALL) && !constants.PILOT_LOGIN.includes(userid)) {
    res.send('<h4>Sorry. You are not in the login access list. Please contact the admin.</h4>');
    return;
  }
  if (password !== passwordRepeat) {
    res.send("<h4>The passwords aren't matching.</h4>");
    return;
  }
  const passHash = auth.hash(password);

  
  if (await auth.checkLogin(userid)) {
    res.send('<h4>This userid already exists.</h4>');
    return;
  }

  await auth.storeLogin(userid, passHash);

  auth.setLoginCookie(res, userid, passHash);
  res.send(htmx.getSuccessLogin());
});

router.get('/widget/dashboard', loginCookieChecker, (req, res) => {
  res.send(htmx.getDashboard(htmx.getHtmxWidgetProps(res)));
});

router.get('/widget/status', loginCookieChecker, (req, res) => {
  res.send(htmx.getStatusWidget(htmx.getHtmxWidgetProps(res)));
});

router.get('/htmx', (req, res) => {
  res.set('Cache-control', `private, max-age=${constants.cache_ttl}`);
  res.sendFile(path.join(__dirname, '../public/htmx.min.js'));
});

router.get('/lit', (req, res) => {
  res.set('Cache-control', `private, max-age=${constants.cache_ttl}`);
  res.sendFile(path.join(__dirname, '../public/lit.css'));
});

router.get('/util', (req, res) => {
  res.set('Cache-control', `private, max-age=${constants.cache_ttl}`);
  res.sendFile(path.join(__dirname, '../public/util.css'));
});

router.get('/alpine', (req, res) => {
  res.set('Cache-control', `private, max-age=${constants.cache_ttl}`);
  res.sendFile(path.join(__dirname, '../public/alpine_3_13_3.min.js'));
});

router.get('/tooltip', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/tooltip.css'));
});

router.get('/403', (req, res) => {
  res.set('Cache-control', `private, max-age=${constants.cache_ttl}`);
  res.statusCode = 403;
  res.sendFile(path.join(__dirname, '../public/403.html'));
});
router.get('/404', (req, res) => {
  res.set('Cache-control', `private, max-age=${constants.cache_ttl}`);
  res.statusCode = 404;
  res.sendFile(path.join(__dirname, '../public/404.html'));
});
router.get('/406', (req, res) => {
  res.set('Cache-control', `private, max-age=${constants.cache_ttl}`);
  res.statusCode = 406;
  res.sendFile(path.join(__dirname, '../public/406.html'));
});
router.get('/500', (req, res) => {
  res.set('Cache-control', `private, max-age=${constants.cache_ttl}`);
  res.statusCode = 500;
  res.sendFile(path.join(__dirname, '../public/500.html'));
});
router.get('/svg-delete', (req, res) => {
  res.set('Cache-control', `private, max-age=${constants.cache_ttl}`);
  res.sendFile(path.join(__dirname, '../public/svg/delete.svg'));
});
router.get('/svg-edit', (req, res) => {
  res.set('Cache-control', `private, max-age=${constants.cache_ttl}`);
  res.sendFile(path.join(__dirname, '../public/svg/edit.svg'));
});
router.get('/svg-restart', (req, res) => {
  res.set('Cache-control', `private, max-age=${constants.cache_ttl}`);
  res.sendFile(path.join(__dirname, '../public/svg/restart.svg'));
});
router.get('/svg-refresh', (req, res) => {
  res.set('Cache-control', `private, max-age=${constants.cache_ttl}`);
  res.sendFile(path.join(__dirname, '../public/svg/refresh.svg'));
});
router.get('/svg-stop', (req, res) => {
  res.set('Cache-control', `private, max-age=${constants.cache_ttl}`);
  res.sendFile(path.join(__dirname, '../public/svg/stop.svg'));
});
router.get('/svg-progress-cursor', (req, res) => {
  res.set('Cache-control', `private, max-age=${constants.cache_ttl}`);
  res.sendFile(path.join(__dirname, '../public/svg/progress-cursor.svg'));
});
router.get('/svg-progress-hourglass', (req, res) => {
  res.set('Cache-control', `private, max-age=${constants.cache_ttl}`);
  res.sendFile(path.join(__dirname, '../public/svg/progress-hourglass.svg'));
});

router.get('*', (req, res) => {
  res.redirect(`${constants.contextPath}/404`);
});

export default router;
