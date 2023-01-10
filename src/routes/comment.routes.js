const express = require('express');
const passport = require('passport');
const CommentController = require('../controllers/comment.controllers');

const commentRouter = express.Router();

commentRouter.get('/:postId/comments', CommentController.getComments);

//  router to get a specific post by supplying post slug or id
commentRouter.get('/:postId/comments/:commentId', CommentController.getComment);

commentRouter.post(
  '/:postId/comments',
  passport.authenticate('jwt', { session: false }),
  CommentController.createComment
);

commentRouter.put(
  '/:postId/comments/:commentId',
  passport.authenticate('jwt', { session: false }),
  CommentController.updateComment
);

commentRouter.put(
  '/:postId/comments/:commentId/publish',
  passport.authenticate('jwt', { session: false }),
  CommentController.publishComment
);

commentRouter.delete(
  '/:postId/comments/:commentId',
  passport.authenticate('jwt', { session: false }),
  CommentController.deleteComment
);

module.exports = commentRouter;
