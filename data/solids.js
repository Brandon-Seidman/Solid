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

function findLocationRange(loc,x){
  let num1 = parseInt(loc) + x;
  let num2 = parseInt(loc) - x;

  if (num1.toString().length == 6){
    num1 = '99999';
  }
  else{
    num1 = num1.toString();
  }
  if(num1.length == 4){
    num1 = '0' + num1;
  }
  else if(num1.length == 3){
    num1 = '00' + num1;
  }
  else if(num1.length == 2){
    num1 = '000' + num1;
  }
  else if(num1.length == 1){
    num1 = '0000' + num1;
  }

  if(num2 <= 0){
    num2 = '00001';
  }
  else{
    num2 = num2.toString();
  }
  if(num2.length == 4){
    num2 = '0' + num2;
  }
  else if(num2.length == 3){
    num2 = '00' + num2;
  }
  else if(num2.length == 2){
    num2 = '000' + num2;
  }
  else if(num1.length == 1){
    num2 = '0000' + num2;
  }

  return [num1, num2];
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

  async getSolidByLocationRange(loc,x) {
    let locR = findLocationRange(loc,x);
    const solidCollection = await solids();
    const solid = await solidCollection.find({ location: {$lte: locR[0], $gte: locR[1]}  });
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
    //console.log(typeof(tag));
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
    if (solid == []) throw "solid(s) not found";
    // const solid = await solidCollection.find({  });
    // if (!solid) throw "solid(s) not found";
    return solid;
  },


  async getSolidByUser(user) {
    const solidCollection = await solids();
    const solid = await solidCollection.find({ postedBy: user}).toArray();
    if (!solid) throw "solid not found";
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
