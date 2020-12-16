const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("solids/searchlo.handlebars", {
    title: "Location Search",
  });
  return;
});

module.exports = router;
