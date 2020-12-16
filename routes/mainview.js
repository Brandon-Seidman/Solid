const express = require("express");
const router = express.Router();
const data = require("../data");
const solidData = data.solids;
const userData = data.users;

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
  const solid = await solidData.getAllSolids();
  return res.render("solids/mainview.handlebars", {
    title: "Home",
    solid: solid,
    user: req.cookies.AuthCookie,
  });
});

router.post("/", async (req, res) => {
  const {
    location,
    description,
    postedBy,
    accepted,
    completed,
    comments,
    buddyID,
    price,
    timestamp,
    tags,
  } = req.body;
  if (
    !location ||
    !description ||
    !postedBy ||
    accepted === null ||
    completed === null ||
    !comments ||
    !price ||
    !timestamp ||
    !tags
  )
    throw "Error: All fields required";
  if (
    !location.trim() ||
    !description.trim() ||
    !postedBy.trim() ||
    !Number.isInteger(price) ||
    !timestamp.trim()
  )
    throw "Error: All fields require non-empty strings";

  const userInfo = await userData.getUserByUsername(postedBy);
  let newSolid = await solidData.addSolid(
    userInfo.zip,
    description,
    postedBy,
    accepted,
    completed,
    comments,
    buddyID,
    price,
    timestamp,
    tags
  );

  let solids = await solidData.getAllSolids();
});
module.exports = router;
