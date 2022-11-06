const jwt = require("jsonwebtoken");
require("dotenv").config();
const passport = require("passport");
const User = require("../models/user.models");

//create new user
const userSignUp = async function (req, res, next) {
  res.status(201).json({
    message: "Signup successful",
    user: req.user,
  });
};

//login existing user
const userLogin = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        const error = new Error("username or password is incorrect");
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email };

        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
          expiresIn: 3600,
        });
        res.setHeader("Authorization", "Bearer token");
        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

//change password
// handles the change password request
const changePassword = async (req, res) => {
  const userInfo = req.body;
  await User.findOne({ email: req.user.email }, (err, user) => {
    if (err) {
      next(err);
    }
    user.changePassword(
      userInfo.password,
      userInfo.new_password,
      (err, user) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json({
            success: "Password changed successfully!",
          });
        }
      }
    );
  });
};

module.exports = {
  userSignUp,
  userLogin,
  changePassword,
};
