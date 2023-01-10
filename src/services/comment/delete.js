const Post = require('../../models/post.models');
const User = require('../../models/user.models');
const Comment = require('../../models/comment.models');
const { NotFoundError, AuthorizationError } = require('../../lib/errors/index');

async function deleteOneComment (req, params) {
  const { postId, commentId } = params;

  const user = await User.findOne({ _id: req.user._id });

  const post = await Post.findOne({ _id: postId });

  const comment = await Comment.findOne({ _id: commentId });

  if (!comment) {
    throw new NotFoundError('comment not found');
  };

  if (comment.author.email !== req.user.email) {
    throw new AuthorizationError('user is not the owner of comment, user cannot delete comment');
  };

  await comment.deleteOne({ _id: commentId });

  //  remove deleted comment id from user.comment
  if (user) {
    const userCommentIndex = user.comments.indexOf(comment._id);
    user.comments.splice(userCommentIndex, 1);
    await user.save();
  }

  //  remove deleted comment id from post.comment
  if (post) {
    const postCommentIndex = post.comment.indexOf(comment._id);
    post.comment.splice(postCommentIndex, 1);
    await post.save();
  }
};

module.exports = deleteOneComment;
