const express = require("express");
const router = express.Router();
const solids = require("../data/solids");
let { ObjectID } = require('mongodb');

function isValidString(string) {
    if (!string) return false;
    if (typeof(string) !== 'string') return false;
    if (string.trim().length === 0) return false;
    return true;
}

function isValidId(string) {
    if (!isValidString) return false;
    try {
        const parsedId = ObjectId(string);
        return true;
    } catch (e) {
        return false;
    }
}

router.get("/:id", async (req, res) => {
    if (!isValidId(req.params.id)) {
        res.status(400).json({error: "id is not a valid ObjectId"});
        return;
    }
    try {
        const solid = await solids.getSolidById(req.params.id);
        res.status(200).json(result);
    } catch (e) {
        if (e === 'solid not found') {
            res.status(404).json({error: "Solid not found"});
            return;
        } else {
            res.status(500).json({error: e});
            return;
        }
    }
    

})