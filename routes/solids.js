const express = require("express");
const router = express.Router();
const solids = require("../data/solids");
const users = require("../data/users");
const comments = require("../data/comments");
const uuid = require('uuid');

function isValidString(string) {
    if (!string) return false;
    if (typeof(string) !== 'string') return false;
    if (string.trim() === '') return false;
    return true;
}

function isValidId(string) {
    if (!isValidString(string)) return false;
    return uuid.validate(string)
}

function error(res, status, message) {
    res.status(status).json({error: message});
}

router.post('/accept', async (req, res) => {
    if (!isValidId(req.body.id)) {
        error(res, 400, "id is not a valid UUID");
        return;
    }
    
    const solid = await solids.getSolidById(req.body.id);
    if (!solid) {
        error(res, 404, "Solid not found");
        return;
    }

    if (!req.cookies.AuthCookie) {
        error(res, 403, "You must be logged in to accept a solid");
        return;
    }
    const user = await users.getUserByUsername(req.cookies.AuthCookie);

    if (!user) {
        error(res, 403, "You must be logged in as a valid user to accept a solid");
        return;
    }

    solid.accepted = true;
    solid.buddyID = user._id;

    solids.updateSolid(solid._id, solid.location, solid.description, solid.postedBy, solid.accepted, solid.completed, solid.comments, solid.buddyID, solid.price, solid.timestamp, solid.tags);

    res.status(200).redirect(`/solids/${req.body.id}`)
});

router.post('/complete', async (req, res) => {
    if (!isValidId(req.body.id)) {
        error(res, 400, "id is not a valid UUID");
        return;
    }
    
    const solid = await solids.getSolidById(req.body.id);
    if (!solid) {
        error(res, 404, "Solid not found");
        return;
    }

    if (!req.cookies.AuthCookie) {
        error(res, 403, "You must be logged in to complete a solid");
        return;
    }
    const user = await users.getUserByUsername(req.cookies.AuthCookie);

    if (!user) {
        error(res, 403, "You must be logged in as a valid user to complete a solid");
        return;
    }

    if (user._id !== solid.buddyID) {
        error(res, 403, "You must be the user that accepted this solid to complete it");
        return;
    }

    solid.completed = true;
    user.solidsCompleted = user.solidsCompleted + 1;

    solids.updateSolid(solid._id, solid.location, solid.description, solid.postedBy, solid.accepted, solid.completed, solid.comments, solid.buddyID, solid.price, solid.timestamp, solid.tags);
    users.updateUser(user._id, user.name, user.username, user.password, user.email, user.zip, user.solidsCreated, user.solidsCompleted, user.isBuddy);

    res.status(200).redirect(`/solids/${req.body.id}`)
});

router.post('/comment', async (req, res) => {
    if (!isValidId(req.body.id)) {
        error(res, 400, "id is not a valid UUID");
        return;
    }
    
    const solid = await solids.getSolidById(req.body.id);
    if (!solid) {
        error(res, 404, "Solid not found");
        return;
    }

    if (!req.body.comment) {
        error(res, 400, "Must include a comment");
        return;
    }

    if (!typeof(req.body.comment) === 'string') {
        error(res, 400, "Comment is not of valid type");
        return;
    }
    if (req.body.comment.trim() === '') {
        error(res, 400, "Comment must not be empty");
        return;
    }

    if (!req.cookies.AuthCookie) {
        error(res, 403, "You must be logged in to post a comment");
        return;
    }

    const user = await users.getUserByUsername(req.cookies.AuthCookie);

    if (!user) {
        error(res, 403, "You must be logged in as a valid user to post a comment");
        return;
    }
    
    const comment = await comments.addComment(user.username, req.body.comment, solid._id, new Date());

    solid.comments.push(comment._id)

    await solids.updateSolid(solid._id, solid.location, solid.description, solid.postedBy, solid.accepted, solid.completed, solid.comments, solid.buddyID, solid.price, solid.timestamp, solid.tags);

    res.status(200).redirect(`/solids/${req.body.id}`)

});

router.get("/:id", async (req, res) => {

    if (!isValidId(req.params.id)) {
        error(res, 400, "id is not a valid UUID")
        return;
    }
		
    try {
        const solid = await solids.getSolidById(req.params.id);

        //solid.timestamp = solid.timestamp.toDateString();
        const creator = await users.getUserByUsername(solid.postedBy);
        let solidComments = [];

        for (comment of solid.comments) {
            const commentObject = await comments.getCommentById(comment);
			console.log(commentObject);
            commentObject.timestamp = commentObject.timestamp.toDateString();
            const commentPoster = await users.getUserByUsername(commentObject.commentBy);
            commentObject.commentBy = commentPoster.username;
            solidComments.push(commentObject);
        }

        const user = await users.getUserByUsername(req.cookies.AuthCookie);
        let acceptedSolid;
        if (solid.buddyID === user._id) {
            acceptedSolid = true;
        } else {
            acceptedSolid = false;
        }
        let createdSolid;
        if (solid.postedBy === user.username) {
            createdSolid = true;
            console.log("The user created this solid");
        } else {
            createdSolid = false;
            console.log("The user did not create this solid")
        }

        res.status(200).render("solids/solid.handlebars", {
            title: "Solid",
            solid: solid,
            creator: creator,
            comments: solidComments,
            acceptedSolid: acceptedSolid,
            createdSolid: createdSolid
        });
    } catch (e) {
        if (e === 'solid not found') {
            error(res, 404, "Solid not found");
            return;
        } else {
            error(res, 500, e);
            return;
        }
    }
    

})

router.put("/", async (req, res) => {
  const {
	id,
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
	console.log(req.body);
	console.log(postedBy);
  const userInfo = await users.getUserByUsername(postedBy);
  console.log("HERE");
  console.log(id);
  let newSolid = await solids.updateSolid(
	id,
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
});

module.exports = router;