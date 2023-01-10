const User = require('../../models/user.models');
const Post = require('../../models/post.models');
const Comment = require('../../models/comment.models');
const { NotFoundError, AuthorizationError } = require('../../lib/errors');

async function updateUser (req, params, body) {
  const userDetails = body;
  const { username } = params;

  //  take in user's new update and add it to a new object
  //  exclude password and email in case the user added it as input
  //  password and email update require special methods
  const newDetails = {};

  for (const detail in userDetails) {
    if (detail !== 'email' && detail !== 'password' && detail !== 'posts') {
      newDetails[detail] = userDetails[detail];
    }
  }

  newDetails.updatedAt = new Date();

  const user = await User.findOne({ username });

  if (!user) {
    throw new NotFoundError('user not found');
  }

  if (user.email !== req.user.email) {
    throw new AuthorizationError('unauthorized');
  }

  await User.updateOne(
    { email: req.user.email },
    { $set: newDetails }
  );

  const post = await Post.find({ 'author.email': req.user.email });

  post.forEach(async element => {
    const newPost = { ...element.author, ...newDetails };
    element.author = newPost;
    await element.save();
  });

  const comment = await Comment.find({ 'author.email': req.user.email });

  comment.forEach(async element => {
    const newComment = { ...element.author, ...newDetails };
    element.author = newComment;
    await element.save();
  });
}

module.exports = updateUser;
