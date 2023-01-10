const Post = require('../../models/post.models');
const User = require('../../models/user.models');
const postReadingTime = require('../../utils/reading_time');
const { ServiceError } = require('../../lib/errors/index');

async function createPost (req, body) {
  const newPost = body;
  //  `seperate tags(coming as strings) into array
  if (newPost.tags) {
    const tags = newPost.tags.replace(/\s/g, '').split(',');
    newPost.tags = tags;
  }

  //  user should not be able to set readCount and readingTime of post
  if (newPost.readCount) {
    delete newPost.readCount;
  }

  //  readingTime is calculated automatically from body
  if (newPost.readingTime) {
    delete newPost.readingTime;
  }

  if (newPost.state) {
    delete newPost.state;
  }

  //  calculate reading time
  const readingTime = await postReadingTime(newPost.body);
  newPost.readingTime = readingTime;

  //  add author
  const user = await User.findOne({ email: req.user.email }).select({
    password: false,
    __v: false,
    posts: false,
    id: false,
    updatedAt: false
  });

  newPost.author = user;
  const post = await Post.create(newPost);

  if (!post) {
    throw new ServiceError('An error while creating post!!!');
  }

  await User.updateOne({ _id: req.user._id }, { $push: { posts: post } });
  return post;
};

module.exports = createPost;
