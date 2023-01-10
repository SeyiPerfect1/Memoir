const AuthenticationController = require('../controllers/auth.controllers');
const express = require('express');
const passport = require('passport');

const authRouter = express.Router();

//  user signup route
authRouter.post(
  '/signup',
  passport.authenticate('signup', {
    session: false
  }),
  AuthenticationController.userSignUp
);

//  user Signin route
authRouter.post('/login', AuthenticationController.userLogin);

module.exports = authRouter;
