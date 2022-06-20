
// const mongodb = require('mongodb');
import mongodb from 'mongodb';

const dbName = `${process.env.DB_NAME}`;

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {

  MongoClient.connect(`${process.env.MONGO_URL}`)
  .then(client => {
    console.log('Connected')
    _db = client.db(dbName)
    callback();
  })
  .catch(err => {
    console.log(err);
    throw err;
  })
}

const getDb = () => {
  // If there is a _db return that instance
  if(_db){
    return _db;
  }

  throw  "No database found."

}


exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
