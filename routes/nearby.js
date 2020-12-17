const mongoCollections = require('../config/mongoCollections');
const connection = require('../config/mongoConnection');
const express = require("express");
const router = express.Router();
let { ObjectId } = require('mongodb');
const solids = require("../data/solids");
const users = require("../data/users");
const solidList = mongoCollections.solids;

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
  //console.log("got here");
  try{
    let username = req.cookies.AuthCookie;
    //console.log(username);
    const zip = await users.getUserZipByUsername(username);
    //console.log(zip);
    const solid = await solids.getSolidByLocationRange(zip,50);
    //console.log(solid);
    if(solid.length == 0){
      return res.render("solids/nearby.handlebars", {
        title: "Nearby Solids",
        error: "No Solids Near You."
      });
    }else{
      return res.render("solids/nearby.handlebars", {
    	title: "Nearby Solids",
      solid: solid
      });
    };
  }catch(e){
    res.status(404).render("solids/nearby.handlebars", {
      title: "Nearby Solids",
      error: "Error Finding Solids."
    });
  }
});


router.post('/', async (req, res) => {
  let sTerm = req.body.searchTerm;
  //console.log("got here2");
  try {
    if (!sTerm || sTerm == '') {
      throw 'Enter term';
    }
    let username = req.cookies.AuthCookie;
    const zip = await users.getUserZipByUsername(username);
    //console.log(zip);
    const solid = await solids.getSolidByLocationRange(zip,sTerm);
    if(solid.length == 0){
      return res.render("solids/nearby.handlebars", {
        title: "Nearby Solids",
        error: "No Solids Near You."
      });
    } else {
      return res.render("solids/nearby.handlebars", {
      	title: "Nearby Solids",
        solid: solid
      });
    }
  }catch(e){
    res.status(404).render("solids/nearby.handlebars", {
      title: "Nearby Solids",
      error: "Error Finding Solids."
    });
  }
});

module.exports = router;
