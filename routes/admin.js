const path = require("path");

const express = require("express");
const productsController = require("../controllers/products");

const router = express.Router();

const products = [];

router.get("/add-product", productsController.getAddProducts);

router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.router = router;
exports.products = products;
