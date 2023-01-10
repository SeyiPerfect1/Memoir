const User = require('../../models/user.models');
const Comment = require('../../models/comment.models');
const { NotFoundError } = require('../../lib/errors');

async function getUserAllComments (req, params, query) {
  const { state } = query;
  const { username } = params;

  const user = await User.findOne({ username }).select({
    password: false,
    __v: false,
    posts: false,
    _id: false,
    id: false
  });

  if (!user) {
    throw new NotFoundError('user not Found');
  };

  let comments;

  if (user.email === req.user.email) {
    const filter = { 'author.username': username };
    if (state) {
      filter.state = state;
    }
    comments = await Comment.find(filter);
  } else {
    comments = await Comment.find({
      'author.username': username,
      state: 'published'
    });
  }
  if (!comments || comments.length === 0) {
    comments = `${username} has no comment yet`;
  }

  return { comments, username };
};

module.exports = getUserAllComments;
