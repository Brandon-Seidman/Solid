const buddies = require('../data/buddies');
const users = require('../data/users');
const solids = require('../data/solids');
const comments = require('../data/comments');

const bcrypt = require('bcrypt');
const saltRounds = 16;

async function main() {
    // Generate Buddies
    let buddiesArray = [];
    for (let i = 0; i < 10; ++i) {
        bcrypt.hash('12345', saltRounds, function(err, hash) {
            buddiesArray[i] = await buddies.addBuddy(`Firstname Lastname`, `Buddy${i}`, hash, `Buddy${i}@solid.com`, 0);
        });
    }

    // Generate Users
    let usersArray = [];
    for (let i = 0; i < 10; ++i) {
        bcrypt.hash('12345', saltRounds, function(err, hash) {
            usersArray[i] = await users.addUser(`Firstname Lastname`, `User${i}`, hash, `User${i}@solid.com`, 0);
        });
    }

    // Generate Solids
    let solidsArray = [];
    for (user of usersArray) {
        let userSolids = [];
        userSolids[0] = await solids.addSolid('07030', `${user.username}'s Solid 1`, user._id, false, false, [], null, 300, new Date(), ['laundry', 'errands']);
        userSolids[1] = await solids.addSolid('07030', `${user.username}'s Solid 2`, user._id, false, false, [], null, 300, new Date(), ['laundry', 'errands']);
        solidsArray.push(userSolids[0]);
        solidsArray.push(userSolids[1]);
        users.updateUser(user._id, user.name, user.username, user.password, user.email, userSolids);
    }

    // Generate Comments
    let commentsArray = [];
    for (solid of solidsArray) {
        newSolid = await comments.addComment(solid.postedBy, "This is a comment by the solid owner", solid._id, new Date());
        solids.updateSolid(solid._id, solid.location, solid.description, solid.postedBy, solid.accepted, solid.completed, [newSolid._id], solid.buddyID, solid.price, solid.timestamp, solid.tags);
    }
}

main();