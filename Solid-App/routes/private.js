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

let authentication = async function (req, res, next) {
  let username = req.cookies.AuthCookie;
  if (!username) {
    res.status(403).render("show/error.handlebars");
  } else {
    next();
  }
};

router.use(logging);
router.use(authentication);
router.get("/", async (req, res) => {
  let username = req.cookies.AuthCookie;
  let user;
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      user = users[i];
    }
  }
  res.render("login/private.handlebars", {
    title: "private",
    error: false,
    user: user,
  });
});

module.exports = router;
