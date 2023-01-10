const Post = require('../../models/post.models');
const { NotFoundError } = require('../../lib/errors/index');

async function publishOnePost (params) {
  const { slug } = params;

  const post = await Post.findOne({ slug: slug.toLowerCase() });

  if (!post) {
    throw new NotFoundError('post not found');
  };

  await Post.updateOne({ slug: slug.toLowerCase() }, { $set: { state: 'published', publishedAt: Date.now() } });

  return post;
}

module.exports = publishOnePost;
