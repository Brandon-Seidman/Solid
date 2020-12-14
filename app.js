const session = require("express-session");
const express = require("express");
const app = express();
const configRoutes = require("./routes");
const cookieParser = require("cookie-parser");
const path = require("path");
app.use(cookieParser());
const exphbs = require("express-handlebars");

const static = express.static(path.join(__dirname + "/public"));

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

configRoutes(app);
app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
