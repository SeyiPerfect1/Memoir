const Comment = require('../../models/comment.models');
const { NotFoundError } = require('../../lib/errors/index');

async function getComment (params) {
  const { commentId } = params;
  const comment = await Comment.findOne({ _id: commentId });

  if (!comment) {
    throw new NotFoundError('comment not found');
  };

  return comment;
}

module.exports = getComment;
