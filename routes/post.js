const express = require("express");
const router = express.Router();
const dbConnection = require("../config/mongoConnection");
const data = require("../data");
const userData = data.users;
const solidData = data.solids;

router.get("/");
