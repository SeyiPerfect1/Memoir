const getManyComments = require('../services/comment/getMany');
const getOneComment = require('../services/comment/getOne');
const createNewComment = require('../services/comment/create');
const updateOneComment = require('../services/comment/update');
const publishOneComment = require('../services/comment/publish');
const deleteOneComment = require('../services/comment/delete');
const { NotFoundError, AuthorizationError } = require('../lib/errors/index');
const commentSchema = require('../validation/comment.validation');

class CommentController {
  //  function to get all comments of a particular post
  static getComments = async (req, res, next) => {
    try {
    //  check if only one else set agrregation pipeline to achieve and filtering
      const comment = await getManyComments(req.query);

      res.status(200).json({
        result: `${comment?.totalComment} result(s) found`,
        totalPages: comment?.totalPages,
        currentPage: comment?.pageNO,
        limit: comment?.commentLimit,
        message: comment?.post
      });
    } catch (err) {
      next(err);
    }
  };

  //  function to get a specific comment
  static getComment = async (req, res, next) => {
    try {
      const comment = await getOneComment(req.params);

      if (comment.state === 'published') {
        res.status(200).json({
          message: comment
        });
      } else {
        throw new NotFoundError('you can only view published comment or draft comment created by you!!!');
      };
    } catch (err) {
      next(err);
    }
  };

  //  function to create new comment
  static createComment = async (req, res, next) => {
    try {
      try {
        await commentSchema.validateAsync(req.body);
      } catch (err) {
        next(err);
      }

      const comment = await createNewComment(req, req.params, req.body);

      res.status(201).json({
        message: 'comment created successfully',
        body: comment.body,
        state: comment.state
      });
    } catch (err) {
      next(err);
    }
  };

  //  function to update a comment
  static updateComment = async (req, res, next) => {
    try {
      try {
        await commentSchema.validateAsync(req.body);
      } catch (err) {
        next(err);
      }

      await updateOneComment(req, req.params, req.body);

      res.status(200).json({
        message: 'comment updated successfully'
      });
    } catch (err) {
      next(err);
    }
  };

  // function to publish a comment
  static publishComment = async (req, res, next) => {
    try {
      const comment = await publishOneComment(req, req.params);

      if (comment.author.email === req.user.email) {
        res.status(200).json({
          message: 'comment published successfully'
        });
      } else {
        throw new AuthorizationError('user is not the owner of comment, user cannot publish comment');
      }
    } catch (err) {
      next(err);
    }
  };

  // function to delete a comment
  static deleteComment = async (req, res, next) => {
    try {
      await deleteOneComment(req, req.params);

      res.status(200).json({
        message: 'comment deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = CommentController;
