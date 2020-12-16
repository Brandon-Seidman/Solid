const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const userData = data.users;
router.get("/", (req, res) => {
  return res.render("login/login.handlebars", { title: "Login" });
});
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !username.trim() || !password || !password.trim()) {
      throw "Error: No username or password received";
    }

    const users = await userData.getAllUsers();

    let hashedPassword = "";
    let user;
    for (let i = 0; i < users.length; i++) {
      if (users[i].username.toLowerCase() === username)
        hashedPassword = users[i].password;
      user = users[i];
    }
    if (hashedPassword === "") {
      return res
        .status(401)
        .render("login/login.handlebars", { title: "Login", error: true });
    }

    bcrypt.compare(password, hashedPassword, async (err, response) => {
      if (err) {
        console.log(err);
        console.log(":( wrong password");
        throw ":( wrong password";
      }
      if (response) {
        res.cookie("AuthCookie", username);
        res.redirect("/mainview");

        return;
      } else {
        return res
          .status(401)
          .render("login/login.handlebars", { title: "Login", error: true });
      }
    });
  } catch (e) {
    console.log(e);
    return res
      .status(401)
      .render("login/login.handlebars", { title: "Login", error: true });
  }
});

module.exports = router;
