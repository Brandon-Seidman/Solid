const login = require("./login");
const logout = require("./logout");
const signup = require("./signup");
const private = require("./private");
const mainview = require("./mainview");
//const solids = require("./solids");
const search = require("./search");
const searchkw = require("./searchkw");
const searchst = require("./searchst");
const searchlo = require("./searchlo");
const account = require("./account");
const userData = require("../data/users");
const dbConnection = require("../config/mongoConnection");
//const post = require("./post");

const constructorMethod = (app) => {
  app.use("/login", login);
  app.use("/logout", logout);
  app.use("/signup", signup);
  app.use("/private", private);
  app.use("/mainview", mainview);
  app.use("/search", search);
  app.use("/searchkw", searchkw);
  app.use("/searchst", searchst);
  app.use("/searchlo", searchlo);
  app.use("/account", account);
  //app.use("/solids", solids);
  //app.use(logging);
  app.get("/", async (req, res) => {
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
