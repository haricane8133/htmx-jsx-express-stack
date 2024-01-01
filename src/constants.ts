import dotenv from 'dotenv';
import { defaultTo as _defaultTo, toLower as _toLower } from 'lodash';

dotenv.config();

const ALL = 'ALL';

const pilotLogin = JSON.parse(_defaultTo(process.env.PILOT_LOGIN, `["${ALL}"]`));
const ADMIN = JSON.parse(_defaultTo(process.env.ADMIN, '[]'));

export const constants = {
  PILOT_LOGIN: [...pilotLogin, ...ADMIN],
  ADMIN,
  ALL,

  contextPath: _defaultTo(process.env.CONTEXT_PATH, '/path'),
  host: _defaultTo(process.env.HOST, '0.0.0.0'),
  port: Number(_defaultTo(process.env.PORT, '8080')),
  
  cryptoKey: process.env.CRYPTO_KEY, // COMPULSORY - 32 characters
  cryptoIv: process.env.CRYPTO_IV, // COMPULSORY - 16 characters

  loginCookieName: _defaultTo(process.env.LOGIN_COOKIE_NAME, 'login'),
  loginCookieLifeHr: Number(_defaultTo(process.env.LOGIN_COOKIE_LIFE_HR, '12')),

  sstorerLifeMins: Number(_defaultTo(process.env.SSTORER_LIFE_MINS, '3000')),
  sstorerUsersFile: _defaultTo(process.env.SSTORER_FILE, 'users.json'), // If you change this, make sure to add it to .gitignore
  sstorerMainSess: _defaultTo(process.env.SSTORER_MAIN_SESS, 'MAIN'),
  sstorerMainSessUserList: _defaultTo(process.env.SSTORER_MAIN_SESS_USER_LIST, 'USERS'),
  cache_ttl: Number(_defaultTo(process.env.CACHE_TTL, '864000')),
  maxDecimals: Number(_defaultTo(process.env.MAX_DECIMALS, '6')),

  enable_mongo: _toLower(_defaultTo(process.env.MONGO_ID, 'FaLsE')) !== 'true' ? false : true,
  mongo_id: process.env.MONGO_ID,
  mongo_user: process.env.MONGO_USER,
  mongo_pswd: process.env.MONGO_PSWD,
  mongo_db: process.env.MONGO_DB,
  mongo_queries: _defaultTo(process.env.MONGO_QUERIES, 'retryWrites=true&w=majority'),
  mongo_collection_users: _defaultTo(process.env.MONGO_COLLECTION_USERS, 'users'),
};

export const vars = {
  status: 'status',
};
