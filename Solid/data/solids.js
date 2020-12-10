const mongoCollections = require('../config/mongoCollections');
const solids = mongoCollections.solids;
const uuid = require('uuid');

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
    if (!solid) throw 'solid not found';
    return solid;
  },
  
  async addSolid(location,description,postedBy,accepted,completed,comments,buddyID,price,timestamp,tags) {
    const solidCollection = await solids();

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
	  _id: uuid.v4()
    };

    const newInsertInformation = await solidCollection.insertOne(newSolid);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
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
  
  async updateSolid(id, location,description,postedBy,accepted,completed,comments,buddyID,price,timestamp,tags) {
    const solid = await this.getSolidById(id);
    console.log(solid);

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
	  tags: tags
    };

    const solidCollection = await solids();
    const updateInfo = await solidCollection.updateOne(
      { _id: id },
      { $set: solidUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update failed';

    return await this.getSolidById(id);
  }
};

module.exports = exportedMethods;