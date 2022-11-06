const express = require("express");
const logger = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const { changePassword } = require("./src/controllers/auth.controllers");

const authRouter = require("./src/routes/auth.routes");
const userRouter = require("./src/routes/user.routes");
const postRouter = require("./src/routes/post.routes.js");

const app = express();

//use passport middleware
require("./src/middlewares/auth");

//security middleware
// app.use(helmet());

//use logger middleware
app.use(logger("dev"));

//middleware to serve public files
app.use(express.static(path.join(__dirname, "./src/public")));

//use body parsr middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//set view engine
app.set("view engine", "ejs");
app.set("views", "views");

//add routes
app.use("/accounts", authRouter);
app.use("/posts", postRouter);
app.use("/", userRouter);

//homepage route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "welcome home",
  });
});

//change password route
app.post(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  changePassword
);

//unavailable resources route
app.get("*", (req, res) => {
  try {
    res.json({
      message: "No page found, check url!!!",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = app;
