const express = require("express");
const router = express.Router();
const solidData = require("../data/solids");
const users = require("../data/users");
const comments = require("../data/comments");
const uuid = require('uuid');

let authentication = async function (req, res, next) {
  let username = req.cookies.AuthCookie;
  if (!username) {
    res.status(403).render("login/error.handlebars");
  } else {
    next();
  }
};

router.use(authentication);
router.get("/", async (req, res) => {
  let username = req.cookies.AuthCookie;
  
  const solid = await solidData.getSolidByUser(username);

  return res.render("solids/account.handlebars", {
	title: "My Account", 
    solid: solid
  });
});
module.exports = router;