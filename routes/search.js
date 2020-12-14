const express = require("express");
const router = express.Router();
const users = require("../users");

router.get("/", async (req, res) => {
  res.render("solids/search.handlebars", {
    title: "Search",
  });
  return;
});

module.exports = router;
