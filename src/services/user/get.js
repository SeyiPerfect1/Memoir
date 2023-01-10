const User = require('../../models/user.models');
const { NotFoundError } = require('../../lib/errors');

async function getUser (req, params, query) {
  const { username } = params;

  const user = await User.findOne({ username }).select({
    password: false,
    __v: false,
    posts: false,
    comments: false,
    id: false
  });

  if (!user) {
    throw new NotFoundError('user not Found');
  };
  return user;
};

module.exports = getUser;
