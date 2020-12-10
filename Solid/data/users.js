const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const uuid = require('uuid');

let exportedMethods = {
  async getAllUsers() {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    return userList;
  },
  // This is a fun new syntax that was brought forth in ES6, where we can define
  // methods on an object with this shorthand!
  async getUserById(id) {
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: id });
    if (!user) throw 'User not found';
    return user;
  },
  
  async addUser(name,username,password,email,solidsCreated) {
    const userCollection = await users();

    let newUser = {
      name: name,
      username: username,
	  password: password,
	  email:email,
	  solidsCreated: solidsCreated,
      _id: uuid.v4()
    };

    const newInsertInformation = await userCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
    return await this.getUserById(newInsertInformation.insertedId);
  },
  
  async removeUser(id) {
    const userCollection = await users();
    const deletionInfo = await userCollection.deleteOne({ _id: id });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete user with id of ${id}`;
    }
    return true;
  },
  
  async updateUser(id, name,username,password,email,solidsCreated) {
    const user = await this.getUserById(id);
    console.log(user);

    const userUpdateInfo = {
      name: name,
      username: username,
	  password: password,
	  email: email,
	  solidsCreated: solidsCreated
    };

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: id },
      { $set: userUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update failed';

    return await this.getUserById(id);
  }
};

module.exports = exportedMethods;