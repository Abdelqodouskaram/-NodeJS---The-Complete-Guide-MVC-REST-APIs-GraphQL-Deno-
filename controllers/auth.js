const bcryptjs = require("bcryptjs");
const nodeMailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodeMailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  message = message.length ? message[0] : null;
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  message = message.length ? message[0] : null;
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const passowrd = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password!");
        return res.redirect("/login");
      }
      bcryptjs
        .compare(passowrd, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password!");
          res.redirect("/login");
        })
        .catch((error) => {
          console.log(
            "🚀 ~ file: auth.js:32 ~ bcryptjs.compare ~ error:",
            error
          );
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userData) => {
      if (userData) {
        req.flash("error", "Email already exists!");
        return res.redirect("/signup");
      }
      bcryptjs.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email: email,
          password: hashedPassword,
        });
        user.save().then((user) => {
          res.redirect("/login");
          return transporter
            .sendMail({
              to: email,
              from: "abdelqodous.karam@intcore.com",
              subject: "Signup Succeeded!",
              html: "<h1>You successfully signed up!</h1>",
            })
            .catch((error) => {
              console.log("🚀 ~ file: auth.js:94 ~ user.save ~ error:", error);
            });
        });
      });
    })
    .catch((error) => {
      console.log("🚀 ~ file: auth.js:50 ~ User.findOne ~ error:", error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
