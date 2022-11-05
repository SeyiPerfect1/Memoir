const Post = require("../models/post.models");
const User = require("../models/user.models");
const dayjs = require("dayjs");
const readingTime = require("../utils/reading_time");


//function to get a specific post
const getPost = async (req, res, next) => {
  const { slug, id } = req.params;
  try {
    const post = await Post.findOne(
      { $or: [ { id: id }, { slug: slug}] }
    );
    console.log(post)
    post.readCount = post.readCount+1;
    await post.save()
    
    res.status(200).json({
      message: post,
    });
  } catch (err) {
    next(err);
  }
};

//function to get posts
const getPosts = async (req, res, next) => {
  //destructure query parameters
  const { pageNo, limit, order_by, tags, title, author, start, end } =
    req.query;

  //deduct 1 from the page no before multiplying with the limit value
  //if page is not provided in query, set to 0
  const page = pageNo - 1 || 0;

  const findQuery = [];
  //check if author or title or tag is not provided in query params
  //if none is provided pass in an empty string
  if (!author && !title && !tags) {
    findQuery.push({});
  }
  //if author is provided as a query params
  //set the query in an object and push into the findquery array
  if (author) {
    const userDetails = await User.findOne({ username: author });
    findQuery.push({ author: userDetails.username });
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
        $lt: moment(endDate).endOf("day"),
      },
    });
  }

  //sorting posts according to sort query given in query parameter
  //by default, each query is sorted by publishedDate in descending order
  //A sample url pattern for the sort query is:
  //http://myapp.com/books?sort=author+asc,datePublished+desc&count=12
  //where "," separates the sort attributes
  //while "+" separtes the field used for the sort and the sorting value
  const sortQuery = {};
  if (order_by) {
    const sortAttributes = order_by.split(",");
    for (const attribute of sortAttributes) {
      const sortField = attribute.split(" ")[0];
      const sortValue = attribute.split(" ")[1];
      if (sortValue === "asc") {
        sortQuery[sortField] = 1;
      }

      if (sortValue === "desc") {
        sortQuery[sortField] = -1;
      }
    }

    if (!sortAttributes.includes("datePublished")) {
      sortQuery.dataPublished = -1;
    }
  }

  try {
    //check if only one else set agrregation pipeline to achieve and filtering
    const post = await Post.find({ $or: findQuery, state: "published" })
      .skip(page * limit || page * 20)
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

//function to create new post
const createPost = async (req, res, next) => {
  const newPost = req.body;

  //seperate tags(coming as strings) into array
  const tags = req.body.tags.replace(/\s/g, "").split(",");
  newPost.tags = tags;

  //calculate reading time
  const reading_time = await readingTime(newPost.body);
  newPost.readingTime = reading_time;

  try {
    newPost.author = req.user._id;
    const post = await Post.create(newPost);
    await User.updateOne({ _id: req.user._id }, { $push: { posts: post } });
    res.status(201).json({
      message: "post created successfully",
    });
  } catch (err) {
    next(err);
  }
};

//function to update post
const updatePost = async (req, res, next) => {
  const { slug, id } = req.query;
  const newPost = req.body;

  //seperate tags(coming as strings) into array
  const tags = req.body.tags.replace(/\s/g, "").split(",");
  newPost.tags = tags;

  //calculate reading time
  if (newPost.body) {
    const reading_time = await readingTime(newPost.body);
    newPost.readingTime = reading_time;
  }

  if (newPost["state"] !== undefined) {
    if (newPost["state"] === "draft") {
      newPost["publishedAt"] = Date.now();
    }
  }

  let query = [];
  if (slug) {
    query.push({ slug: slug });
  }
  if (id) {
    query.push({ _id: id });
  }

  try {
    await Post.updateOne(
      { $or: { slug: slug, _id: id } },
      { $set: { newPost } }
    );
    res.status(200).json({
      message: "post updated successfully",
    });
    // else {
    //   res.status(401).json({
    //     message: "user is not the owner of post, user cannot update it",
    //   });
    // }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPosts,
  createPost,
  updatePost,
  getPost,
};
