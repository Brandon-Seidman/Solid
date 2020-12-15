const express = require("express");
const router = express.Router();

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
