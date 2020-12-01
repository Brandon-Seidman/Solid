const mongoCollections = require('../config/mongoCollections');
const buddies = mongoCollections.buddies;
const uuid = require('uuid');

let exportedMethods = {
  async getAllBuddies() {
    const buddyCollection = await buddies();
    const buddyList = await buddyCollection.find({}).toArray();
    return buddyList;
  },
  // This is a fun new syntax that was brought forth in ES6, where we can define
  // methods on an object with this shorthand!
  async getBuddyById(id) {
    const buddyCollection = await buddies();
    const buddy = await buddyCollection.findOne({ _id: id });
    if (!buddy) throw 'buddy not found';
    return buddy;
  },
  
  async addBuddy(name,username,password,email,solidsCreated) {
    const buddyCollection = await buddies();

    let newBuddy = {
      name: name,
      username: username,
	  password: password,
	  email:email,
	  solidsCreated: solidsCreated,
      _id: uuid.v4()
    };

    const newInsertInformation = await buddyCollection.insertOne(newBuddy);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
    return await this.getBuddyById(newInsertInformation.insertedId);
  },
  
  async removeBuddy(id) {
    const buddyCollection = await buddies();
    const deletionInfo = await buddyCollection.deleteOne({ _id: id });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete buddy with id of ${id}`;
    }
    return true;
  },
  
  async updateBuddy(id, name,username,password,email,solidsCreated) {
    const buddy = await this.getBuddyById(id);
    console.log(buddy);

    const buddyUpdateInfo = {
      name: name,
      username: username,
	  password: password,
	  email: email,
	  solidsCreated: solidsCreated
    };

    const buddyCollection = await buddies();
    const updateInfo = await buddyCollection.updateOne(
      { _id: id },
      { $set: buddyUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update failed';

    return await this.getBuddyById(id);
  }
};

module.exports = exportedMethods;