const Mongodb = require("mongodb");
const MongoClient = Mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "MongoURI"
  )

    .then((client) => {
      console.log("Connected!");
      callback();
      _db = client.db();
    })
    .catch((error) => {
      console.log("🚀 ~ file: database.js:9 ~ ).then ~ error:", error);
      throw error;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No Database Found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
