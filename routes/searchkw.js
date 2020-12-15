const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("solids/searchkw.handlebars", {
    title: "Key Search",
  });
  return;
});

module.exports = router;
