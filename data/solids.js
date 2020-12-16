const mongoCollections = require("../config/mongoCollections");
const solids = mongoCollections.solids;
const uuid = require("uuid");

function isInList(x, lst){
  for(let i = 0; i < lst.length; i++){
    if (x == lst[i]){
      return true;
    }
  }
  return false;
}

let exportedMethods = {
  async getAllSolids() {
    const solidCollection = await solids();
    const solidList = await solidCollection.find({}).toArray();
    return solidList;
  },
  // This is a fun new syntax that was brought forth in ES6, where we can define
  // methods on an object with this shorthand!
  async getSolidById(id) {
    const solidCollection = await solids();
    const solid = await solidCollection.findOne({ _id: id });
    if (!solid) throw "solid not found";
    return solid;
  },

  async getSolidByLocation(loc) {
    const solidCollection = await solids();
    const solid = await solidCollection.find({ location: loc });
    if (!solid) throw "solid(s) not found";
    return solid.toArray();
  },

  async getSolidByKey(key) {
    var regex = new RegExp(key);
    //console.log(regex);
    const solidCollection = await solids();
    //console.log(typeof(solidCollection));
    const solid = await solidCollection.find({ description: regex });
    if (!solid) throw "solid(s) not found";
    return solid.toArray();
  },

  async getSolidByTag(tag) {
    const solidCollection = await solids();
    let solid = [];
    const solidsList = await solidCollection.find({}).toArray();
    // console.log(solidCollection);
    for (let i = 0; i < solidsList.length; i++){
      //console.log(solidsList[i].tags);
      if(isInList(tag,solidsList[i].tags) == true){
        solid.push(solidsList[i]);
      }
    }
    // const solid = await solidCollection.find({  });
    // if (!solid) throw "solid(s) not found";
    return solid;
  },

  async addSolid(
    location,
    description,
    postedBy,
    accepted,
    completed,
    comments,
    buddyID,
    price,
    timestamp,
    tags
  ) {
    const solidCollection = await solids();

    if (
      !location ||
      !description ||
      !postedBy ||
      accepted == null ||
      completed == null ||
      !comments ||
      !buddyID ||
      !price ||
      !timestamp ||
      !tags
    )
      throw "Please provide all data when creating a solid";

    if (typeof location !== "string") throw "location must be a string";
    if (typeof description !== "string") throw "description must be a string";
    if (typeof postedBy !== "string") throw "postedBy must be a string";
    if (typeof accepted !== "boolean") throw "accepted must be a boolean";
    if (typeof completed !== "boolean") throw "completed must be a boolean";
    if (!Array.isArray(comments)) throw "comments must be a array";
    if (typeof buddyID !== "string") throw "buddyID must be a string";
    if (typeof price !== "number") throw "price must be a number";

    let newSolid = {
      location: location,
      description: description,
      postedBy: postedBy,
      accepted: accepted,
      completed: completed,
      comments: comments,
      buddyID: buddyID,
      price: price,
      timestamp: timestamp,
      tags: tags,
      _id: uuid.v4(),
    };

    const newInsertInformation = await solidCollection.insertOne(newSolid);
    if (newInsertInformation.insertedCount === 0) throw "Insert failed!";
    return await this.getSolidById(newInsertInformation.insertedId);
  },

  async removeSolid(id) {
    const solidCollection = await solids();
    const deletionInfo = await solidCollection.deleteOne({ _id: id });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete solid with id of ${id}`;
    }
    return true;
  },

  async updateSolid(
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
    tags
  ) {
    const solid = await this.getSolidById(id);
    console.log(solid);
    if (location)
      if (typeof location !== "string") throw "location must be a string";
    if (description)
      if (typeof description !== "string") throw "description must be a string";
    if (postedBy)
      if (typeof postedBy !== "string") throw "postedBy must be a string";
    if (accepted)
      if (typeof accepted !== "boolean") throw "accepted must be a boolean";
    if (completed)
      if (typeof completed !== "boolean") throw "completed must be a boolean";
    if (comments)
      if (!Array.isArray(comments)) throw "comments must be a array";
    if (buddyID)
      if (typeof buddyID !== "string") throw "buddyID must be a string";
    if (price) if (typeof price !== "number") throw "price must be a number";

    const solidUpdateInfo = {
      location: location,
      description: description,
      postedBy: postedBy,
      accepted: accepted,
      completed: completed,
      comments: comments,
      buddyID: buddyID,
      price: price,
      timestamp: timestamp,
      tags: tags,
    };

    const solidCollection = await solids();
    const updateInfo = await solidCollection.updateOne(
      { _id: id },
      { $set: solidUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";

    return await this.getSolidById(id);
  },
};

module.exports = exportedMethods;
