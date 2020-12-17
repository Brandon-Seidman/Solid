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
  let username = req.cookies.AuthCookie;
  //console.log(username);
  const zip = await users.getUserZipByUsername(username);
  //console.log(zip);
  const solid = await solids.getSolidByLocationRange(zip,5);
  //console.log(solid);
  return res.render("solids/nearby.handlebars", {
	title: "Neaby Solids",
  solid: solid
  });
});

// router.get("/", async (req, res) => {
//   //solid = await solids.getSolidByLocation('07030');
//   //console.log(solid);
//   res.render("solids/searchlo.handlebars", {
//     title: "Location Search",
//     //solid: solid
//   });
//   return;
// });
//
// router.post('/', async (req, res) => {
//   let sTerm = req.body.searchTerm;
//   try {
//     if (!sTerm || sTerm == '') {
//       throw 'Enter term';
//     }
//     solid = await solids.getSolidByLocation(sTerm);
//     if(solid.length == 0){
//       res.render("solids/searchlo.handlebars", {
//         title: "Location Search",
//         error: "No Solids Found."
//       });
//     } else {
//       res.render("solids/searchlo.handlebars", {
//         title: "Loaction Search",
//         solid: solid,
//       });
//     }
//   }catch(e){
//     res.status(404).render("solids/searchlo.handlebars", {
//       title: "Location Search",
//       error: "Error Finding Solids."
//     });
//   }
// });

module.exports = router;
