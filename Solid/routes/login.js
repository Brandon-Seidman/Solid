const express = require("express");
const router = express.Router();
//const bcrypt = require("bcrypt");
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
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    // let hashedPassword = "";
    // let user;
    // for (let i = 0; i < users.length; i++) {
    //   if (users[i].username === username)
    //     hashedPassword = users[i].hashedPassword;
    //   user = users[i];
    // }
    // if (hashedPassword === "") {
    //   res.status(401).render("login/login.handlebars", {
    //     title: "Login",
    //     error: true,
    //   });
    //   return;
    // }
    // bcrypt.compare(password, hashedPassword, (err, response) => {
    //   if (err) {
    //     res
    //       .status(401)
    //       .render("login/login.handlebars", { title: "Login", error: true });
    //   }
    //   if (response) {
    //     res.cookie("AuthCookie", username);
    //     res.redirect("/private");
    //   } else {
    //     res
    //       .status(401)
    //       .render("login/login.handlebars", { title: "Login", error: true });
    //   }
    // });
    res.status(401).render("login/login.handlebars", {
      title: "Login",
      error: true,
    });
  } catch (e) {
    res
      .status(401)
      .render("login/login.handlebars", { title: "Login", error: true });
  }
});

module.exports = router;
