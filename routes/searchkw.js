const mongoCollections = require('../config/mongoCollections');
const connection = require('../config/mongoConnection');
const express = require("express");
const router = express.Router();
let { ObjectId } = require('mongodb');
const solids = require("../data/solids");
const solidList = mongoCollections.solids;

router.get("/", async (req, res) => {
  //solid = await solids.getSolidByKey('boy');
  //console.log(solid);
  res.render("solids/searchkw.handlebars", {
    title: "Key Search",
    //solid: solid,
  });
  return;
});

// router.get("/:key", async (req, res) => {
//   solid = await solids.getSolidByKey('hob');
//   //console.log(solid);
//   res.render("solids/searchkw.handlebars", {
//     title: "Key Search",
//     solid: solid,
//   });
//   return;
// });

router.post('/', async (req, res) => {
  let sTerm = req.body.searchTerm;
  try {
    if (!sTerm || sTerm == '') {
      throw 'Enter term';
    }
    solid = await solids.getSolidByKey(sTerm);
    if(solid.length == 0){
      res.render("solids/searchkw.handlebars", {
        title: "Key Search",
        error: "No Solids Found."
      });
    } else {
      res.render("solids/searchkw.handlebars", {
        title: "Key Search",
        solid: solid,
      });
    }
  }catch(e){
    res.status(404).render("solids/searchkw.handlebars", {
      title: "Key Search",
      error: "Error Finding Solids."
    });
  }
});

module.exports = router;
