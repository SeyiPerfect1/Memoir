const Post = require('../../models/post.models');
const Comment = require('../../models/comment.models');
const postReadingTime = require('../../utils/reading_time');
const { NotFoundError, AuthorizationError } = require('../../lib/errors/index');

async function updateOnePost (req, params, body) {
  const { slug } = params;
  const postUpdate = body;

  //  seperate tags(coming as strings) into array
  if (postUpdate.tags) {
    const tags = postUpdate.tags.replace(/\s/g, '').split(',');
    postUpdate.tags = tags;
  }

  //  readCount and radingTime should can not be updated by the user
  if (postUpdate.readCount) {
    delete postUpdate.readCount;
  }
  if (postUpdate.readingTime) {
    delete postUpdate.readingTime;
  }
  //  check if update consists of changing state to pushided.
  if (postUpdate.state) {
    delete postUpdate.state;
  }

  //  calculate reading time
  if (postUpdate.body) {
    const readingTime = await postReadingTime(postUpdate.body);
    postUpdate.readingTime = readingTime;
  }
  postUpdate.updatedAt = new Date();

  const post = await Post.findOne({ slug: slug.toLowerCase() });

  if (!post) {
    throw new NotFoundError('post not found');
  };

  //  create new slug from title
  if (postUpdate.title) {
    const titleSlug = postUpdate.title.replaceAll(' ', '-').toLowerCase();
    const newSlug = titleSlug + '-' + post._id.toString();
    postUpdate.slug = newSlug;
  }
  //  create new description, if no description was added on while updating title
  if (!postUpdate.description && postUpdate.title) {
    postUpdate.description = postUpdate.title;
  }
  if (post.author.email !== req.user.email) {
    throw new AuthorizationError('user is not the owner of post, user cannot update post');
  } else {
    await Post.updateOne({ slug: slug.toLowerCase() }, { $set: postUpdate });
  }

  const comment = await Comment.find({ 'author.email': req.user.email });

  comment.forEach(async element => {
    const newPost = { ...element.post, ...postUpdate };
    element.author = newPost;
    await element.save();
  });
};

module.exports = updateOnePost;
