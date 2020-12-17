const express = require("express");
const router = express.Router();
const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const bcrypt = require("bcrypt");
const xss = require("xss");
router.get("/", async (req, res) => {
  res.status(200).render("login/signup.handlebars", { title: "Sign Up" });
  return;
});
router.post("/", async (req, res) => {
  try {
    const { email, password, username, first_name, last_name, zip } = req.body;
    if (
      !email ||
      !email.trim() ||
      !password ||
      !username ||
      !password.trim() ||
      !username.trim() ||
      !first_name ||
      !first_name.trim() ||
      !last_name ||
      !last_name.trim() ||
      !zip ||
      !zip.trim()
    )
      throw "Error: Attribute not received ";

    let userList = await users.getAllUsers();
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].email === email) {
        throw "Oh no! Looks like that email is already taken :(";
      }
      if (userList[i].username === username) {
        throw "Oh no! Looks like that username is already taken :(";
      }
    }
    // IF NOT - ADD TO DATABASE
    const saltRounds = 10;

    let hash = await bcrypt.hash(password, saltRounds);
    let newUser = await users.addUser(
      `${first_name} ${last_name}`,
      username,
      hash,
      email,
      zip,
      [],
      0,
      false
    );
    res.cookie("AuthCookie", username);
    return res.redirect("/mainview");

    // LOG USER IN
    //FIX ERROR CAN'T CHANGE SCREENS
  } catch (e) {
    console.log(e);
    return res.status(401).render("login/signup.handlebars", {
      title: "Sign Up",
      error: true,
    });
  }
});

module.exports = router;
