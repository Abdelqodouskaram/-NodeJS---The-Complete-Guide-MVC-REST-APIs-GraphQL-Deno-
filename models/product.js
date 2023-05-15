const mongodb = require("mongodb");
const { getDb } = require("../util/database");

class Product {
  constructor(title, price, description, imageUrl, id = null, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp = db;
    if (this._id) {
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then((result) => {
        console.log(
          "🚀 ~ file: product.js:17 ~ Product ~ .then ~ result:",
          result
        );
      })
      .then((error) => {
        console.log(error);
      });
  }

  static findAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((error) => {
        console.log(
          "🚀 ~ file: product.js:41 ~ Product ~ findAll ~ error:",
          error
        );
      });
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(id) })
      .next()
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log(
          "🚀 ~ file: product.js:62 ~ Product ~ .then ~ error:",
          error
        );
      });
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then(() => {
        console.log("Deleted");
      })
      .catch((error) => {
        console.log(
          "🚀 ~ file: product.js:85 ~ Product ~ .then ~ error:",
          error
        );
      });
  }
}

module.exports = Product;
