const express = require("express");
const router = express.Router();
const users = require("../users");

router.get("/", async (req, res) => {
  res.render("solids/mainview.handlebars", {
    title: "Home",
  });
  return;
});

module.exports = router;
