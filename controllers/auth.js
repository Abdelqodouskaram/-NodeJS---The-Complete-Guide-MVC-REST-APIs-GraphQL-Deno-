const crypto = require("crypto");

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
const user = require("../models/user");
const { validationResult } = require("express-validator");

exports.getLogin = (req, res, next) => {
  let message = req.flash("errorMessage");
  message = message.length ? message[0] : null;
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const passowrd = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "login",
      errorMessage: errors.array()[0].msg,
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: message,
        });
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
          req.flash("errorMessage", "Invalid email or password!");
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

exports.getSignup = (req, res, next) => {
  let message = req.flash("errorMessage");
  console.log("🚀 ~ file: auth.js:32 ~ message:", message);
  message = message.length ? message[0] : null;
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
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
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("errorMessage");
  message = message.length ? message[0] : null;
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log("🚀 ~ file: auth.js:127 ~ crypto.randomBytes ~ err:", err);
      res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((user) => {
        res.redirect("/");
        transporter
          .sendMail({
            to: req.body.email,
            from: "abdelqodous.karam@intcore.com",
            subject: "Reset Password",
            html: "<h1>You successfully signed up!</h1>",
          })
          .catch((error) => {
            console.log("🚀 ~ file: auth.js:94 ~ user.save ~ error:", error);
          });
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.redirect("/reset");
      }
      let message = req.flash("errorMessage");
      message = message.length ? message[0] : null;
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id,
        passwordToken: token,
      });
    })
    .catch((error) => {
      console.log("🚀 ~ file: auth.js:160 ~ User.findOne ~ error:", error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const password = req.body.password;
  const passwordToken = req.body.passwordToken;
  const userId = req.body.userId;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    _id: userId,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res.redirect("/reset");
      }
      resetUser = user;
      return bcryptjs.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((user) => {
      return res.redirect("/login");
    })
    .catch((error) => {
      console.log("🚀 ~ file: auth.js:189 ~ error:", error);
    });
};
