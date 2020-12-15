const express = require("express");
const router = express.Router();

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
  return res.render("solids/mainview.handlebars", {
    title: "Home",
    user: req.cookies.AuthCookie,
  });
});

module.exports = router;
