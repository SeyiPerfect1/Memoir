const Post = require('../../models/post.models');
const User = require('../../models/user.models');
const Comment = require('../../models/comment.models');
const { ServiceError, NotFoundError } = require('../../lib/errors/index');

async function createNewPost (req, params, body) {
  const newComment = body;
  const { postId } = params;

  if (newComment.state) {
    delete newComment.state;
  }

  //  add author
  const user = await User.findOne({ email: req.user.email }).select({
    password: false,
    __v: false,
    posts: false,
    comments: false,
    id: false,
    updatedAt: false
  });

  newComment.author = user;

  const post = await Post.findOne({ _id: postId, state: 'published' }).select({
    __v: false,
    author: false,
    id: false,
    updatedAt: false,
    comment: false
  });

  if (!post) {
    throw new NotFoundError('You cannot comment on a post that have been deleted');
  }

  newComment.post = post;

  const comment = await Comment.create(newComment);

  if (!comment) {
    throw new ServiceError('An error occur while creating comment!!!');
  }

  await User.updateOne({ _id: req.user._id }, { $push: { comments: comment._id } });

  await Post.updateOne({ _id: postId }, { $push: { comment: comment._id } });

  return comment;
};

module.exports = createNewPost;
