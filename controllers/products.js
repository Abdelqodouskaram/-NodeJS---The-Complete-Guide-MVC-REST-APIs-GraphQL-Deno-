exports.getAddProducts = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formCss: true,
    productCss: true,
    productActive: true,
  });
};
