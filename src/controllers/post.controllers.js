const Post = require("../models/post.models");
const User = require("../models/user.models");
const dayjs = require("dayjs");
const readingTime = require("../utils/reading_time");

//function to get posts
const getPosts = async (req, res, next) => {
  //destructure query parameters
  const { page, limit, id, order_by, tags, title, author, start, end } =
    req.query;

  //deduct 1 from the page no before multiplying with the limit value
  //if page is not provided in query, set to 0
  const pageNO = parseInt(page) - 1 || 0;

  const findQuery = [];
  //check if author or title or tag is not provided in query params
  //if none is provided pass in an empty string
  if (!author && !title && !tags && !id) {
    findQuery.push({});
  }
  //if author is provided as a query params
  //set the query in an object and push into the findquery array
  if (author) {
    findQuery.push({ "author.username": author });
  }

  //check for id
  if (id) {
    findQuery.push({ id: { $regex: `${id}`, $options: "i" } });
  }

  //if title is provided as a query params
  //set the query to match the title as a regex in an object
  //and push into the findquery array
  if (title) {
    findQuery.push({ title: { $regex: `${title}`, $options: "i" } });
  }
  //if tags is/are provided as a query params
  //set the query to match document that match one/more of the tag(s) in an object
  //and push into the findquery array
  //tags should be separated by space or mysql standard '+' in the url
  if (tags) {
    const tagQuery = tags.split(" ");
    findQuery.push({ tags: { $in: tagQuery } });
  }

  //query where published date is in the range start to end date
  //where start and end is in the format dd-mm-yyyy
  //and push to the findQuery array
  if (start && end) {
    const startDate = dayjs(start).format("YYYY-MM-DD");
    const endDate = dayjs(end).format("YYYY-MM-DD");
    findQuery.push({
      publishedAt: {
        $gt: dayjs(startDate).startOf("day"),
        $lt: dayjs(endDate).endOf("day"),
      },
    });
  }

  //sorting posts according to sort query given in query parameter
  //by default, each query is sorted by publishedDate in descending order
  //A sample url pattern for the sort query is:
  //http://myapp.com/books?author+asc&datePublished+desc&title=loremipsum
  //where "," separates the sort attributes
  //while "+" separtes the field used for the sort and the sorting value
  const sortQuery = {};

  if (order_by) {
    sortAttributes = order_by.split(",");

    for (const attribute of sortAttributes) {
      const sortField = attribute.split(" ")[0];
      const sortValue = attribute.split(" ")[1];
      if (sortValue === "asc") {
        sortQuery[sortField] = 1;
        if (sortField === "publishedAt") {
          sortQuery[sortField] = -1;
        }
      }

      if (sortValue === "desc") {
        sortQuery[sortField] = -1;
        if (sortField === "publishedAt") {
          sortQuery[sortField] = 1;
        }
      }
    }
  }
  if (!order_by) {
    sortQuery.publishedAt = -1;
  }

  try {
    //check if only one else set agrregation pipeline to achieve and filtering
    const post = await Post.find({ $or: findQuery, state: "published" })
      .skip(pageNO * limit || pageNO * 20)
      .limit(limit || 20)
      .sort(sortQuery)
      .select({ __v: false });
    res.status(200).json({
      result: `${post.length} result(s) found`,
      message: post,
    });
  } catch (err) {
    next(err);
  }
};

//function to get a specific post
const getPost = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const post = await Post.findOne({ slug: slug.toLowerCase() });
    if (!post) {
      res.json({
        message: "post not found",
      });
    }
    post.readCount = post.readCount + 1;
    await post.save();
    console.log(req.user);

    if (post.state === "published") {
      res.status(200).json({
        message: post,
      });
    } else if (post.state === "draft") {
      res.status(200).json({
        message: "post not found",
      });
    } else {
      //if post slug is not found
      res.status(404).json({
        message: "post not found",
      });
    }
  } catch (err) {
    next(err);
  }
};

//function to create new post
const createPost = async (req, res, next) => {
  const newPost = req.body;

  //seperate tags(coming as strings) into array
  if (newPost.tags) {
    const tags = req.body.tags.replace(/\s/g, "").split(",");
    newPost.tags = tags;
  }

  //user should not be able to set readCount and readingTime of post
  if (newPost.readCount) {
    delete newPost.readCount;
  }
  //readingTime is calculated automatically from body
  if (newPost.readingTime) {
    delete newPost.readingTime;
  }
  //state is default to draft
  if (newPost.state) {
    newPost.state = newPost.state.toLowerCase();
    newPost.publishedAt = Date.now();
  }

  //calculate reading time
  const reading_time = await readingTime(newPost.body);
  newPost.readingTime = reading_time;
  try {
    //add author
    const user = await User.findOne({ email: req.user.email }).select({
      password: false,
      __v: false,
      posts: false,
      id: false,
      updatedAt: false,
    });
    newPost["author"] = user;
    const post = await Post.create(newPost);
    await User.updateOne({ _id: req.user._id }, { $push: { posts: post } });
    res.status(201).json({
      message: "post created successfully",
      title: post.title,
      description: post.description,
      readCount: post.readCount,
      readingTime: post.readingTime,
      state: post.state,
      tags: post.tags,
      slug: post.slug,
    });
  } catch (err) {
    next(err);
  }
};

//function to update post
const updatePost = async (req, res, next) => {
  const { slug } = req.params;
  const postUpdate = req.body;

  //seperate tags(coming as strings) into array
  if (postUpdate.tags) {
    const tags = req.body.tags.replace(/\s/g, "").split(",");
    postUpdate.tags = tags;
  }

  //readCount and radingTime should can not be updated by the user
  if (postUpdate.readCount) {
    delete postUpdate.readCount;
  }
  if (postUpdate.readingTime) {
    delete postUpdate.readingTime;
  }
  //check if update consists of changing state to pushided.
  //if true, add publishedAt
  if (postUpdate.state) {
    postUpdate.state = postUpdate.state.toLowerCase();
    postUpdate.publishedAt = Date.now();
  }

  //calculate reading time
  if (postUpdate.body) {
    const reading_time = await readingTime(postUpdate.body);
    postUpdate.readingTime = reading_time;
  }
  postUpdate.updatedAt = Date.now();
  try {
    const post = await Post.findOne({ slug: slug.toLowerCase() });
    //create new slug from title
    if (postUpdate.title) {
      const titleSlug = postUpdate.title.replaceAll(" ", "-").toLowerCase();
      const newSlug = titleSlug + "-" + post._id.toString();
      postUpdate.slug = newSlug;
    }
    //create new description, if no description was added on while updating title
    if (!postUpdate.description && postUpdate.title) {
      postUpdate.description = postUpdate.title;
    }
    if (post.author.email === req.user.email) {
      await Post.updateOne({ slug: slug.toLowerCase() }, { $set: postUpdate });
      res.status(200).json({
        message: "post updated successfully",
        publishedAt: post.publishedAt,
      });
    } else {
      res.status(401).json({
        message: "user is not the owner of post, user cannot update post",
      });
    }
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const user = await User.findOne({ _id: req.user._id });
    const post = await Post.findOne({ slug: slug.toLowerCase() });

    const index = user.posts.indexOf(post._id);
    if (post.author.email === req.user.email) {
      await post.deleteOne({ slug: slug });
      //remove deleted post id from user.posts
      const index = user.posts.indexOf(post._id);
      user.posts.splice(index, 1);
      await user.save();
      res.status(200).json({
        message: "Post deleted successfully",
      });
    } else {
      res.status(401).json({
        message: "user is not the owner of post, user cannot delete post",
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPosts,
  createPost,
  updatePost,
  getPost,
  deletePost,
};
