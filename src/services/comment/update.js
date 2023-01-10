const Comment = require('../../models/comment.models');
const { NotFoundError, AuthorizationError } = require('../../lib/errors/index');

async function updateOneComment (req, params, body) {
  const { commentId } = params;
  const commentUpdate = body;

  //  check if update consists of changing state to pushided.
  if (commentUpdate.state) {
    delete commentUpdate.state;
  }

  commentUpdate.updatedAt = new Date();

  const comment = await Comment.findOne({ _id: commentId });

  if (!comment) {
    throw new NotFoundError('comment not found');
  };

  if (comment.author.email !== req.user.email) {
    throw new AuthorizationError('user is not the owner of comment, user cannot update comment');
  };

  await Comment.updateOne({ _id: commentId }, { $set: commentUpdate });
};

module.exports = updateOneComment;
