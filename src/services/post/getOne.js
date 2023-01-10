const Post = require('../../models/post.models');
const { NotFoundError } = require('../../lib/errors/index');

async function getOnePost (params) {
  const { slug } = params;
  const post = await Post.findOne({ slug: slug.toLowerCase() });

  if (!post) {
    throw new NotFoundError('post not found');
  };

  post.readCount = post.readCount + 1;
  await post.save();

  return post;
}

module.exports = getOnePost;
