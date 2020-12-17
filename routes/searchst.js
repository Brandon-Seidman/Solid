const mongoCollections = require('../config/mongoCollections');
const connection = require('../config/mongoConnection');
const express = require("express");
const router = express.Router();
let { ObjectId } = require('mongodb');
const solids = require("../data/solids");
const solidList = mongoCollections.solids;

router.get("/", async (req, res) => {
    //solid = await solids.getSolidByTag('errands');
    //console.log(solid);
    res.render("solids/searchst.handlebars", {
    title: "Tag Search",
    //solid: solid
  });
  return;
});

router.post('/', async (req, res) => {
  let sTerm = req.body.searchTerm;
  try {
  //console.log(typeof(sTerm));
    if (!sTerm || sTerm == '') {
      throw 'Enter term';
    }
    solid = await solids.getSolidByTag(sTerm);
    //console.log(solid);
    if(solid.length == 0){
      res.render("solids/searchst.handlebars", {
        title: "Tag Search",
        error: "No Solids Found."
      });
    } else {
      res.render("solids/searchst.handlebars", {
        title: "Tag Search",
        solid: solid,
      });
    }
  }catch(e){
    res.status(404).render("solids/searchst.handlebars", {
      title: "Tag Search",
      error: "Error Finding Solids."
    });
  }
});

module.exports = router;
