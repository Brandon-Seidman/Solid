const mongoCollections = require('../config/mongoCollections');
const connection = require('../config/mongoConnection');
const express = require("express");
const router = express.Router();
let { ObjectId } = require('mongodb');
const solids = require("../data/solids");
const solidList = mongoCollections.solids;

router.get("/", async (req, res) => {
  //solid = await solids.getSolidByLocation('07030');
  //console.log(solid);
  res.render("solids/searchlo.handlebars", {
    title: "Location Search",
    //solid: solid
  });
  return;
});

router.post('/', async (req, res) => {
  let sTerm = req.body.searchTerm;
  try {
    if (!sTerm || sTerm == '') {
      throw 'Enter term';
    }
    solid = await solids.getSolidByLocation(sTerm);
    if(solid.length == 0){
      res.render("solids/searchlo.handlebars", {
        title: "Location Search",
        error: "No Solids Found."
      });
    } else {
      res.render("solids/searchlo.handlebars", {
        title: "Loaction Search",
        solid: solid,
      });
    }
  }catch(e){
    res.status(404).render("solids/searchlo.handlebars", {
      title: "Location Search",
      error: "Error Finding Solids."
    });
  }
});

module.exports = router;
