const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require("uuid");

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
    if (!user) throw "User not found";
    return user;
  },
  async getUserByUsername(usern) {
    const userCollection = await users();
    const user = await userCollection.findOne({ username: usern });
    if (!user) throw "User not found";
    return user;
  },
  async getUserZipByUsername(usern) {
    const userCollection = await users();
    const user = await userCollection.findOne({ username: usern });
    if (!user) throw "User not found";
    return user.zip;
  },
  async addUser(
    name,
    username,
    password,
    email,
    zip,
    solidsCreated,
    solidsCompleted,
    isBuddy
  ) {
    const userCollection = await users();

    if (
      !name ||
      !username ||
      !password ||
      !email ||
      !zip ||
      !solidsCreated ||
      solidsCompleted === null ||
      isBuddy === null
    )
      throw "Please provide all data when creating a user";

    if (typeof name !== "string") throw "name must be a string";
    if (typeof username !== "string") throw "username must be a string";
    if (typeof password !== "string") throw "password must be a string";
    if (typeof zip !== "string") throw "zip must be a string";
    if (typeof email !== "string") throw "email must be a string";
    if (!Array.isArray(solidsCreated)) throw "solidsCreated must be a Array";
    if (!Number.isInteger(solidsCompleted))
      throw "solidsCompleted must be a number";
    if (typeof isBuddy !== "boolean") throw "isBuddy must be a boolean";

    let newUser = {
      name: name,
      username: username.toLowerCase(),
      password: password,
      email: email,
      solidsCreated: solidsCreated,
      solidsCompleted: solidsCompleted,
      isBuddy: isBuddy,
      zip: zip,
      _id: uuid.v4(),
    };

    const newInsertInformation = await userCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw "Insert failed!";
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

  async updateUser(
    id,
    name,
    username,
    password,
    email,
    zip,
    solidsCreated,
    solidsCompleted,
    isBuddy
  ) {
    const user = await this.getUserById(id);

    if (
      !name ||
      !username ||
      !password ||
      !email ||
      !zip ||
      !solidsCreated ||
      solidsCompleted === null ||
      isBuddy === null
    )
      throw "Please provide all data when updating a user";

    if (name) if (typeof name !== "string") throw "name must be a string";
    if (username)
      if (typeof username !== "string") throw "username must be a string";
    if (password)
      if (typeof password !== "string") throw "password must be a string";
    if (email) if (typeof email !== "string") throw "email must be a string";
    if (solidsCreated !== null)
      if (!Array.isArray(solidsCreated)) throw "solidsCreated must be a Array";
    if (solidsCompleted == null)
      if (!Number.isInteger(solidsCompleted))
        throw "solidsCompleted must be a number";
    if (isBuddy == null)
      if (typeof isBuddy !== "boolean") throw "isBuddy must be a boolean";
    if (zip) if (typeof zip !== "string") throw "zip must be a string";
    const userUpdateInfo = {
      name: name,
      username: username.toLowerCase(),
      password: password,
      email: email,
      solidsCreated: solidsCreated,
      solidsCompleted: solidsCompleted,
      isBuddy: isBuddy,
      zip: zip,
    };

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: id },
      { $set: userUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";

    return await this.getUserById(id);
  },
};

module.exports = exportedMethods;
