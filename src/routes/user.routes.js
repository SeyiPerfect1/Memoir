const express = require("express");
const passport = require("passport");
const userController = require("../controllers/user.controllers");

const userRouter = express.Router();

//route to get details/profile fof a user
userRouter.get(
  "/:username",
  passport.authenticate("jwt", { session: false, failureRedirect: "/" }),
  userController.getUserDetails
);

//route to update details of a user 
userRouter.put(
  "/update-profile",
  passport.authenticate("jwt", {
    session: false,
  }),
  userController.updateUser
);

//route to delete account
userRouter.delete(
  "/delete-profile",
  passport.authenticate("jwt", {
    session: false,
  }),
  userController.deleteUser
);

module.exports = userRouter;