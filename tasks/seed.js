const dbConnection = require("../config/mongoConnection");

const data = require("../data");
const userData = data.users;
const solidData = data.solids;
const commentData = data.comments;
const bcrypt = require("bcrypt");

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();
  //**** Encrypts given password and adds new user to the database */

  // Generate Users
  let usersArray = [];

  async function create(
    name,
    username,
    password,
    email,
    solids_made,
    userData
  ) {
    let saltRounds = 10;
    let hash = await bcrypt.hash(password, saltRounds);
    let newUser = await userData.addUser(
      name,
      username,
      hash,
      email,
      solids_made,
      0,
      false
    );
    console.log(newUser);
    usersArray.push(newUser);
    return newUser;
  }

  // **** POPULATE DATABASE WITH USERS **** //

  await create(
    "Shannon Hobby", // FULL NAME
    "shobby", // USERNAME
    "beepbooplettuce", // PASSWORD
    "shannonhobby1@hotmail.com", // EMAIL
    [], // SOLIDS CREATED
    userData
  );

  await create(
    "Dall Falkinder",
    "praesent",
    "ilovemymom",
    "dfalkinder0adrowsfield1@forbes.com",
    [],
    userData
  );

  await create(
    "Alysa Drowsfield",
    "in2010",
    "catlover1234",
    "adrowsfield1@forbes.com",
    [],
    userData
  );

  await create(
    "Rice Beert",
    "nasceture",
    "CJrshgLCW",
    "rbeert2@dyndns.org",
    [],
    userData
  );

  await create(
    "Lorenza Gentry",
    "seedling12",
    "wU82An87",
    "lgentry3@guardian.co.uk",
    [],
    userData
  );

  await create(
    "Brandon Seidman",
    "brandyboy",
    "youmeanyouarenotedsheeran?",
    "bseidman@stevens.edu",
    [],
    userData
  );
  await create(
    "Scott Murray",
    "ScottTheSecond",
    "dontforgettheJR",
    "smurray@stevens.edu",
    [],
    userData
  );

  await create(
    "Jason Meyerberg",
    "heartteddybear",
    "ihavesomanyfinals2020",
    "jmeyerberg@stevens.edu",
    [],
    userData
  );

  await create(
    "Harald Trevino",
    "inquis",
    "PlH1Z9ffZew",
    "htrevino@simplemachines.org",
    [],
    userData
  );

  await create(
    "Paolo Esh",
    "convallis",
    "b1kg9l3O5I5r",
    "pesh1@hubpages.com",
    [],
    userData
  );

  await create(
    "Neile Kurth",
    "dictumst",
    "BrY1fpzbv",
    "nkurth2@answers.com",
    [],
    userData
  );
  let users = await userData.getAllUsers();
  console.log(users);

  console.log("Database successfully seeded!");

  // Generate Solids
  for (user of usersArray) {
    let userSolids = [];
    userSolids[0] = await solidData.addSolid(
      "07030",
      `${user.username}'s Solid 1`,
      user._id,
      false,
      false,
      [],
      "None",
      300,
      new Date(),
      ["laundry", "errands"]
    );
    userSolids[1] = await solidData.addSolid(
      "07030",
      `${user.username}'s Solid 2`,
      user._id,
      false,
      false,
      [],
      "None",
      300,
      new Date(),
      ["laundry", "errands"]
    );
    userData.updateUser(
      user._id,
      user.name,
      user.username,
      user.password,
      user.email,
      userSolids
    );
  }

  // Generate Comments
  const solidsArray = solidData.getAllSolids();

  for (solid of solidsArray) {
    comment = await commentData.addComment(
      solid.postedBy,
      "This is a comment by the solid owner",
      solid._id,
      new Date()
    );
    solidData.updateSolid(
      solid._id,
      solid.location,
      solid.description,
      solid.postedBy,
      solid.accepted,
      solid.completed,
      [comment._id],
      solid.buddyID,
      solid.price,
      solid.timestamp,
      solid.tags
    );
  }
}

main();
