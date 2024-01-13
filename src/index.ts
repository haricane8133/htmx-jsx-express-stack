import express from 'express';
import sstorer = require('sstorer');

import router from './router';
import { constants } from './constants';

// INITIALIZE SSTORER to maintain global session data in-memory
export const store = sstorer.init({
  duration: constants.sstorerLifeMins,
});
// Create another to store exclusively the list of users, to be used in offline non-mongo mode
export const userStore = sstorer.init({
  persistFileName: constants.sstorerUsersFile,
});

if(!constants.enable_mongo) {
  userStore.load(constants.sstorerUsersFile);
}

// INITIALIZE EXPRESS
const app = express();

// Please have some ceontext path. It may be mandatory in this template, as of the time.
app.get('/', (req, res) => res.redirect(constants.contextPath));
app.use(constants.contextPath, router);

app.listen(constants.port, constants.host, () => {
  console.log(`Server is exposed at http://${constants.host}:${constants.port}`);
});
