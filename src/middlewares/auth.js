const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user.models');
require('dotenv').config();
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const { signupSchema, loginSchema } = require('../validation/auth.validation');

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      // jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() // Use this if you are using Bearer token
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// This middleware saves the information provided by the user to the database,
// and then sends the user information to the next middleware if successful.
// Otherwise, it reports an error.
passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const newUser = {};
        newUser.email = email.toLowerCase();
        newUser.password = password;
        newUser.username = req.body.username;
        newUser.firstname = req.body.firstname;
        newUser.lastname = req.body.lastname;

        try {
          await signupSchema.validateAsync(newUser);
        } catch (err) {
          done(err);
        }

        const user = await User.create(newUser);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// This middleware authenticates the user based on the email and password provided.
// If the user is found, it sends the user information to the next middleware.
// Otherwise, it reports an error.
passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      email = email.toLowerCase();

      try {
        await loginSchema.validateAsync({ email, password });
      } catch (err) {
        done(err);
      }

      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: 'username or password is incorrect' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);
