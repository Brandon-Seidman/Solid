const login = require("./login");
const logout = require("./logout");
const signup = require("./signup");
const private = require("./private");
const solids = require("./solids");

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

const constructorMethod = (app) => {
  app.use("/login", login);
  app.use("/logout", logout);
  app.use("/signup", signup);
  app.use("/private", private);
  app.use("/solids", solids);
  app.use(logging);
  app.get("/", (req, res) => {
    if (!req.cookies.AuthCookie) {
      res.render("login/login.handlebars", { title: "Login" });
    } else {
      let username = req.cookies.AuthCookie;

      let user;
      for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
          user = users[i];
        }
      }
      res.render("login/private.handlebars", {
        title: "Private",
        error: false,
        user: user,
      });
    }
  });
  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
