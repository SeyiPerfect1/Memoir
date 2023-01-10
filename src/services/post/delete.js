const Post = require('../../models/post.models');
const User = require('../../models/user.models');
const { NotFoundError, AuthorizationError } = require('../../lib/errors/index');

async function deletePost (req, params) {
  const { slug } = params;

  const user = await User.findOne({ _id: req.user._id });

  const post = await Post.findOne({ slug: slug.toLowerCase() });

  if (!post) {
    throw new NotFoundError('post not found');
  };

  if (post.author.email === req.user.email) {
    await post.deleteOne({ slug: slug.toLowerCase() });

    //  remove deleted post id from user.posts
    if (user) {
      const index = user.posts.indexOf(post._id);
      user.posts.splice(index, 1);
      await user.save();
    }
  } else {
    throw new AuthorizationError('user is not the owner of post, user cannot delete post');
  }
};

module.exports = deletePost;
