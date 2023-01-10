const User = require('../../models/user.models');
const Post = require('../../models/post.models');
const { NotFoundError } = require('../../lib/errors');

async function getUserAllPosts (req, params, query) {
  const { state } = query;
  const { username } = params;

  const user = await User.findOne({ username }).select({
    password: false,
    __v: false,
    posts: false,
    id: false
  });

  if (!user) {
    throw new NotFoundError('user not Found');
  };

  let posts;

  if (user.email === req.user.email) {
    const filter = { 'author.username': username };
    if (state) {
      filter.state = state;
    }
    posts = await Post.find(filter);
  } else {
    posts = await Post.find({
      'author.username': username,
      state: 'published'
    });
  }
  if (!posts || posts.length === 0) {
    posts = `${username} has no post yet`;
  }
  return { posts, username };
};

module.exports = getUserAllPosts;
