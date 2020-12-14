const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.clearCookie("AuthCookie");
  res.render("login/login.handlebars", {
    title: "Login",
    error: false,
    loggedOut: true,
  });
});

module.exports = router;
