const getManyPosts = require('../services/post/getMany');
const getOnePost = require('../services/post/getOne');
const createnewPost = require('../services/post/create');
const updateOnePost = require('../services/post/update');
const publishOnePost = require('../services/post/publish');
const deleteOnePost = require('../services/post/delete');
const { NotFoundError, AuthorizationError } = require('../lib/errors/index');
const postSchema = require('../validation/post.validation');

class PostController {
  //  function to get posts
  static getPosts = async (req, res, next) => {
    try {
    //  check if only one else set aggregation pipeline to achieve and filtering
      const post = await getManyPosts(req.query);

      res.status(200).json({
        page: post?.pageNO,
        limit: post?.postLimit,
        message: post?.post
      });
    } catch (err) {
      next(err);
    }
  };

  //  function to get a specific post
  static getPost = async (req, res, next) => {
    try {
      const post = await getOnePost(req.params);

      if (post.state === 'published') {
        res.status(200).json({
          message: post
        });
      } else {
        throw new NotFoundError('you can only view published posts or draft post created by you!!!');
      };
    } catch (err) {
      next(err);
    }
  };

  //  function to create new post
  static createPost = async (req, res, next) => {
    try {
      try {
        const value = await postSchema.validateAsync(req.body);
        console.log(value);
      } catch (err) {
        next(err);
      }

      const post = await createnewPost(req, req.body);
      res.status(201).json({
        message: 'post created successfully',
        title: post.title,
        description: post.description,
        readCount: post.readCount,
        readingTime: post.readingTime,
        state: post.state,
        tags: post.tags,
        slug: post.slug
      });
    } catch (err) {
      next(err);
    }
  };

  //  function to update post
  static updatePost = async (req, res, next) => {
    try {
    //   try {
    //     const value = await postSchema.validateAsync(req.body);
    //     console.log(value);
    //   } catch (err) {
    //     next(err);
    //   }

      await updateOnePost(req, req.params, req.body);

      res.status(200).json({
        message: 'post updated successfully'
      });
    } catch (err) {
      next(err);
    }
  };

  // function to publish a post
  static publishPost = async (req, res, next) => {
    try {
      const post = await publishOnePost(req.params);

      if (post.author.email === req.user.email) {
        res.status(200).json({
          message: 'Post published successfully'
        });
      } else if (post.author.email !== req.user.email) {
        throw new AuthorizationError('user is not the owner of post, user cannot publish post');
      }
    } catch (err) {
      next(err);
    }
  };

  // function to delete a post
  static deletePost = async (req, res, next) => {
    try {
      await deleteOnePost(req, req.params);

      res.status(200).json({
        message: 'Post deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  };
};

module.exports = PostController;
