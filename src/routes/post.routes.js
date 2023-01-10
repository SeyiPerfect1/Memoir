const express = require('express');
const passport = require('passport');
const PostController = require('../controllers/post.controllers');

const postRouter = express.Router();

postRouter.get('/', PostController.getPosts);

//  router to get a specific post by supplying post slug or id
postRouter.get('/:slug', PostController.getPost);

postRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  PostController.createPost
);

postRouter.put(
  '/:slug',
  passport.authenticate('jwt', { session: false }),
  PostController.updatePost
);

postRouter.put(
  '/:slug/publish',
  passport.authenticate('jwt', { session: false }),
  PostController.publishPost
);

postRouter.delete(
  '/:slug',
  passport.authenticate('jwt', { session: false }),
  PostController.deletePost
);

module.exports = postRouter;
