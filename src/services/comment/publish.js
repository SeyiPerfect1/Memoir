const Comment = require('../../models/comment.models');
const { NotFoundError } = require('../../lib/errors/index');

async function publishOneComment (req, params) {
  const { commentId } = params;
  console.log(commentId);

  const comment = await Comment.findOne({ _id: commentId });

  if (!comment) {
    throw new NotFoundError('comment not found');
  };

  await Comment.updateOne({ _id: commentId }, { $set: { state: 'published', publishedAt: Date.now() } });

  return comment;
}

module.exports = publishOneComment;
