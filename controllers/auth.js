exports.getLogin = (req, res, next) => {
  const isLoggedIn = req
    .get("Cookie")
    .split(";")
    [req.get("Cookie").split(";").length - 1].trim()
    .split("=")[1] === "true";
  console.log("🚀 ~ file: auth.js:3 ~ isLoggedIn:", isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "isLoggedIn=true");
  res.redirect("/");
};
