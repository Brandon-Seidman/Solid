const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("solids/searchst.handlebars", {
    title: "Tag Search",
  });
  return;
});

module.exports = router;
