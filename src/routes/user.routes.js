const express = require('express');
const passport = require('passport');
const UserController = require('../controllers/user.controllers');

const userRouter = express.Router();

//  route to get details/profile for a user
userRouter.get(
  '/:username',
  passport.authenticate('jwt', { session: false }),
  UserController.getUserDetails
);

//  route to get a user post
userRouter.get(
  '/:username/posts',
  passport.authenticate('jwt', { session: false }),
  UserController.getUserPosts
);

//  route to get details/profile fof a user
userRouter.get(
  '/:username/comments',
  passport.authenticate('jwt', { session: false }),
  UserController.getUserComments
);

//  route to update details of a user
userRouter.put(
  '/:username',
  passport.authenticate('jwt', {
    session: false
  }),
  UserController.updateUserDetails
);

//  route to delete account
userRouter.delete(
  '/:username',
  passport.authenticate('jwt', {
    session: false
  }),
  UserController.deleteUserDetails
);

module.exports = userRouter;
