const User = require('../../models/user.models');
const { NotFoundError, AuthorizationError } = require('../../lib/errors');

async function deleteUser (req, params) {
  const { username } = params;

  const user = await User.findOne({ username });

  if (!user) {
    throw new NotFoundError('user not found');
  }

  if (user.email !== req.user.email) {
    throw new AuthorizationError('unauthorized, user cannot delete other user account');
  }

  await User.deleteOne(
    { email: req.user.email }
  );
};

module.exports = deleteUser;
