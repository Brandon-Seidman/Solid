const express = require("express");
const router = express.Router();
const users = require("../users");

router.get("/", async (req, res) => {
  res.render("login/signup.handlebars", {
    title: "Sign up",
  });
  return;
});
router.post("/", async (req, res) => {
  try {
    const { email, username, password, passwordCheck } = req.body;
    console.log(password);
    console.log(passwordCheck);
    if (password !== passwordCheck) {
      res.status(401).render("login/signup.handlebars", {
        title: "Sign Up",
        passNoMatch: true,
      });
      return;
    }

    // CHECK IF EMAIL IS IN DATABASE

    // CHECK IF USERNAME IS IN DATABASE

    // IF NOT - ADD TO DATABASE

    // LOG USER IN
    res.render("login/signup.handlebars");
    return;
  } catch (e) {
    res.status(401).render("login/error.handlebars");
  }
});

module.exports = router;
