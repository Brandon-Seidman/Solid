const express = require("express");
const router = express.Router();
const users = require("../users");

let logging = function (req, res, next) {
  let date = new Date().toUTCString();
  let method = req.method;
  let route = req.originalUrl;
  let username = req.cookies.AuthCookie;
  let auth;
  if (!username) {
    auth = "(Non-Authenticated User)";
  } else {
    auth = "(Authenticated User)";
  }
  console.log(`${date} ${method} ${route} ${auth}`);
  next();
};
router.use(logging);
router.get("/", async (req, res) => {
  res.clearCookie("AuthCookie");
  res.render("login/login.handlebars", {
    title: "Login",
    error: false,
    loggedOut: true,
  });
});

module.exports = router;
