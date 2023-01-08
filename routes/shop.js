const path = require("path");

const express = require("express");

const router = express.Router();

const { products } = require("./admin");

const rootDir = require("../util/path");

router.get("/", (req, res, next) => {
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    productCss: true,
    shopActive: true
  });

  // sending static files
  // res.sendFile(path.join(rootDir, "views/html", "shop.html"));
});

module.exports = router;
