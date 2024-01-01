import { MongoClient, ServerApiVersion } from 'mongodb';
import { isNull as _isNull, isEmpty as _isEmpty } from 'lodash';

import { constants } from './constants';

const uri = `mongodb+srv://${constants.mongo_user}:${constants.mongo_pswd}@${constants.mongo_id}.mongodb.net/?${constants.mongo_queries}`;

// Mongo Objects that you can use
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Actual methods

/**
 * This function returns the Login Object if it exists in the collection.
 * if you do not pass the passHash, then the search would be only on the userid.
 */
export async function getLoginObject(userid: string, passHash: string = '') {
  let matcher: any = {
    userid: {
      $eq: userid,
    },
  };
  if (!_isEmpty(passHash)) {
    matcher = {
      ...matcher,
      passHash: {
        $eq: passHash,
      },
    };
  }
  const result = await client
    .db(constants.mongo_db)
    .collection(constants.mongo_collection_users)
    .findOne(matcher);
  return result;
}

/**
 * This function tells you if the Login Object exists in our Collecion.
 * if you do not pass the passHash, then the search would be only on the userid.
 */
export async function doesLoginExist(userid: string, passHash: string = '') {
  const result = await getLoginObject(userid, passHash);
  if (_isNull(result)) {
    return false;
  }
  if (result.userid === userid) {
    return true;
  }
  return false;
}

export async function storeLoginObject(userid: string, passHash: string) {
  const result = await client
    .db(constants.mongo_db)
    .collection(constants.mongo_collection_users)
    .insertOne({
      userid,
      passHash,
    });

  return result;
}
