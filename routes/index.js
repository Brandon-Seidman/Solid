const login = require("./login");
const logout = require("./logout");
const signup = require("./signup");
const private = require("./private");
const mainview = require("./mainview");
//const solids = require("./solids");
const search = require("./search");
<<<<<<< HEAD
const userData = require("../data/users");
const dbConnection = require("../config/mongoConnection");
=======
//const post = require("./post");

let logging = function (req, res, next) {
  let date = new Date().toUTCString();
  let method = req.method;
  let route = req.originalUrl;
  let username = req.cookies.AuthCookie;
  let auth;
  if (!username) {
    auth = "(Non-Authenticated User)";
  } else {
    auth = "(Authenticated User)";
  }
  console.log(`${date} ${method} ${route} ${auth}`);
  next();
};
>>>>>>> Start of post a solid frontend

const constructorMethod = (app) => {
  app.use("/login", login);
  app.use("/logout", logout);
  app.use("/signup", signup);
  app.use("/private", private);
  app.use("/mainview", mainview);
  app.use("/search", search);
<<<<<<< HEAD
  //app.use("/solids", solids);
  app.get("/", async (req, res) => {
=======
  //app.use("/post", post);
  app.use(logging);
  app.get("/", (req, res) => {
>>>>>>> Start of post a solid frontend
    if (!req.cookies.AuthCookie) {
      return res.redirect("/login");
    } else {
      let username = req.cookies.AuthCookie;
      await dbConnection();
      let users = userData.getAllUsers();
      let user;
      for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
          user = users[i];
        }
      }

      return res.redirect("/mainview");
    }
  });
  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
  return;
};

module.exports = constructorMethod;
