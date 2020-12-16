const mongoCollections = require('../config/mongoCollections');
const connection = require('../config/mongoConnection');
const express = require("express");
const router = express.Router();
let { ObjectId } = require('mongodb');
const solids = require("../data/solids");
const solidList = mongoCollections.solids;

router.get("/", async (req, res) => {
  solid = await solids.getSolidByKey('boy');
  //console.log(solid);
  res.render("solids/searchkw.handlebars", {
    title: "Key Search",
    solid: solid,
  });
  return;
});

module.exports = router;
