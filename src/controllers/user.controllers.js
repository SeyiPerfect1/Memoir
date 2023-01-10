const getUser = require('../services/user/get');
const updateUser = require('../services/user/update');
const deletetUser = require('../services/user/delete');
const getUserAllPosts = require('../services/user/getPosts');
const getUserAllComments = require('../services/user/getComments');
// const userSchema = require('../validation/user.validation');

class UserController {
  //  function to retrieve details of a specific user
  static getUserDetails = async (req, res, next) => {
    try {
      const user = await getUser(req, req.params, req.query);

      res.status(200).json({
        user
      });
    } catch (err) {
      next(err);
    }
  };

  // get user posts
  static getUserPosts = async (req, res, next) => {
    try {
      const post = await getUserAllPosts(req, req.params, req.query);
      res.status(200).json({
        message: `${post.username} has ${post.posts.length || 0} post(s)`,
        posts: post.posts
      });
    } catch (err) {
      next(err);
    }
  };

  //  get user comments return commet
  static getUserComments = async (req, res, next) => {
    try {
      const comments = await getUserAllComments(req, req.params, req.query);

      res.status(200).json({
        message: `${comments.username} has ${comments.comments.length || 0} comment(s)`,
        comments: comments.comments
      });
    } catch (err) {
      next(err);
    }
  };

  static updateUserDetails = async (req, res, next) => {
    try {
      await updateUser(req, req.params, req.body);
      res.status(200).json({
        message: 'user details updated successfully'
      });
    } catch (err) {
      next(err);
    }
  };

  //  delte account
  static deleteUserDetails = async (req, res, next) => {
    try {
      await deletetUser(req, req.params);

      res.status(200).json({
        message: 'user deleted successfuly'
      });
    } catch (err) {
      next(err);
    }
  };
};

module.exports = UserController;
