import crypto from 'crypto';

import { Request, Response } from 'express';
import { defaultTo as _defaultTo, isEmpty as _isEmpty } from 'lodash';

import { constants } from './constants';

import * as mongo from './mongo';
import { statusEvents } from './events';
import { Events, iUser } from './types';
import { store, userStore } from '.';

const algorithm = 'aes-256-cbc';
const key = _defaultTo(constants.cryptoKey, '');
const iv = _defaultTo(constants.cryptoIv, '');

export function encrypt(input: string) {
  const cipher = crypto.createCipheriv(algorithm, key, iv, {});
  let encrypted = cipher.update(input, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decrypt(input: string) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv, {});
  let decrypted = decipher.update(input, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function hash(input: string) {
  const hasher = crypto.createHash('sha256');
  const hashed = hasher.update(input).digest('hex');
  return hashed;
}

export function getCookie(req: Request, name: string, shouldDecrypt: boolean = true) {
  const cookie = req.cookies[name];
  if (_isEmpty(cookie)) {
    return undefined;
  }
  try {
    if(shouldDecrypt) {
      return decrypt(cookie);
    }
    return cookie;
  } catch (error) {
    return undefined;
  }
}

export function setCookie(res: Response, name: string, value: string, lifeHr: number, shouldEncrypt: boolean = true) {
  res.cookie(name, shouldEncrypt ? encrypt(value) : value, {
    maxAge: Number(lifeHr) * 60 * 60 * 1000 + Date.now(),
    httpOnly: true,
    secure: true,
    sameSite: true,
  });
}

export function getLoginCookie(req: Request) {
  const content = getCookie(req, constants.loginCookieName);
  try {
    return JSON.parse(content);
  } catch(error) {
    return undefined;
  }
}

export function setLoginCookie(res: Response, userid: string, passHash: string) {
  const content = JSON.stringify({
    userid,
    passHash,
    time: Date.now()
  });
  setCookie(res, constants.loginCookieName, content, constants.loginCookieLifeHr);
}

/**
 * Function to check login
 * @param userid 
 * @param passHash pass empty to just check if the userid exists in DB
 * @param time 
 * @returns 
 */
export async function checkLogin(
  userid: string,
  passHash: string = '',
  time: string = Date.now().toString(),
) {
  if(constants.enable_mongo) {
    if (
      (await mongo.doesLoginExist(userid, passHash)) &&
      (Date.now() - Number(time)) / 1000 / 60 / 60 < constants.loginCookieLifeHr
    ) {
      statusEvents.emit(Events.status, {userid, status: 'Login Success'});
      return true;
    }
    statusEvents.emit(Events.status, {userid, status: 'Login Failed'});
    return false;
  }
  return checkOfflineLogin(userid, passHash, time);
}

function checkOfflineLogin(
  userid: string,
  passHash: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  time: string = Date.now().toString(),
) {
  const users: iUser[] | undefined | null = userStore.getVar(constants.sstorerMainSess, constants.sstorerMainSessUserList);
  if(!Array.isArray(users)) {
    return false;
  }
  let flag = false;
  if(_isEmpty(passHash)) {
    flag = users.filter((user) => user.userid === userid).length > 0;
  } else {
    flag = users.filter((user) => user.userid === userid && user.passHash === passHash).length > 0;
  }
  if(flag) {
    statusEvents.emit(Events.status, {userid, status: 'Login Success'});
  } else {
    statusEvents.emit(Events.status, {userid, status: 'Login Failed'});
  }
  return flag;
}

export async function storeLogin(userid: string, passHash: string) {
  if(constants.enable_mongo) {
    await mongo.storeLoginObject(userid, passHash);
  } else {
    let users: iUser[] | undefined | null = userStore.getVar(constants.sstorerMainSess, constants.sstorerMainSessUserList);
    if(!Array.isArray(users)) {
      users = [];
    }
    users.push({userid, passHash});
    userStore.putVar(constants.sstorerMainSess, constants.sstorerMainSessUserList, users);
  }
}