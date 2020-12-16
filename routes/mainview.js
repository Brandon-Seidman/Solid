const express = require("express");
const router = express.Router();
const solids = require("../data/solids");

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
  const solid = await solids.getAllSolids();
  console.log(solid);
  return res.render("solids/mainview.handlebars", {
    title: "Home", solid: solid
  });
});

module.exports = router;
