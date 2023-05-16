const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find().then((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.find().then((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = [];
      req.user.cart.items.map((productId) => {
        productId.productId.quantity = productId.quantity;
        products.push(productId.productId);
      });
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch();
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let product = Product.findById(prodId).then((product) => {
    req.user.addToCart(product).then((user) => {
      res.redirect("/cart");
    });
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteItemFromCart(prodId).then((result) => {
    res.redirect("/cart");
  });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = [];
      req.user.cart.items.map((prod) => {
        products.push({
          product: { ...prod.productId._doc },
          quantity: prod.quantity,
        });
      });
      const userObj = {
        name: req.user.name,
        userId: req.user,
      };
      const order = new Order({
        products: products,
        user: userObj,
      });
      order.save().then((order) => {
        req.user.cart.items = [];
        req.user.save().then((user) => {
          res.redirect("/orders");
        });
      });
    })
    .catch();
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((error) => {
      console.log("🚀 ~ file: shop.js:140 ~ error:", error);
    });
};
