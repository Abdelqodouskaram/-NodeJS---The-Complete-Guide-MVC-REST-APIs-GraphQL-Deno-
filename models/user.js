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
    let cartItemIndex = -1;
    if (this.cart.items.length) {
      cartItemIndex = this.cart.items.findIndex((cp) => {
        return cp.productId.toString() == product._id.toString();
      });
    }

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartItemIndex >= 0) {
      newQuantity = this.cart.items[cartItemIndex].quantity + 1;
      updatedCartItems[cartItemIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: product._id, quantity: 1 });
    }

    const updatedCart = { items: updatedCartItems };
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

  getCart() {
    const db = getDb();
    const productsIds = this.cart.items.map((item) => {
      return item.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productsIds } })
      .toArray()
      .then((products) => {
        return products.map((prod) => {
          return {
            ...prod,
            quantity: this.cart.items.find((item) => {
              return item.productId.toString() === prod._id.toString();
            }).quantity,
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    const db = getDb();
    let updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() != productId;
    });
    const updatedCart = { items: updatedCartItems };
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

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: this._id,
            username: this.username,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((order) => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          )
          .then((user) => {
            return user;
          });
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new ObjectId(this._id) })
      .toArray();
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
