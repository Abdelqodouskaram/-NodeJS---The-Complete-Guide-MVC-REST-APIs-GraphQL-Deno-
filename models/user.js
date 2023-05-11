const { getDb } = require("../util/database");
const ObjectId = require("mongodb").ObjectId;

class User {
  constructor(username, email, id, cart) {
    this.username = username;
    this.email = email;
    (this._id = id), (this.cart = cart);
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((user) => {
        return error;
      })
      .catch((error) => {
        console.log("🚀 ~ file: user.js:19 ~ User ~ save ~ error:", error);
      });
  }

  addToCart(product) {
    const updatedCart = { items: [{ proudctId: product._id, quantity: 1 }] };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      )
      .then((user) => {
        return user;
      })
      .catch((error) => {
        console.log("🚀 ~ file: user.js:35 ~ User ~ ).then ~ error:", error);
      });
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        return user;
      })
      .catch((error) => {
        console.log(
          "🚀 ~ file: user.js:28 ~ User ~ returndb.collections ~ error:",
          error
        );
      });
  }
}

module.exports = User;
