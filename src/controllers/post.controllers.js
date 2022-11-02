const Post = require("../models/post.models");
const User = require("../models/user.models");
const dayjs = require("dayjs");
const readingTime = require("../utils/reading_time");

//function to get posts
const getPosts = async (req, res, next) => {
  const { pageNo, limit, order_by, tags, title, author, start, end } = req.query;
    
  const page = pageNo-1 || 0;

  const findQuery = [];
  if(!author&&!title&&!tags){
    findQuery.push({})
  }
  if (author) {
    findQuery.push({ author: author.username });
  }

  if (title) {
    findQuery.push({ title : { $regex: `${title}`, $options: 'i' }});
  }

  if (tags) {
    const tagQuery = tags.split(" ");
    console.log(tagQuery)
    findQuery.push({ tags: { $in: tagQuery } });
  }

  //query where published date is in the range start to end date
  //where start and end is in the format dd-mm-yyyy
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
  //ta sample url pattern for the sort query is:
  //http://myapp.com/books?sort=author+asc,datepublished+desc&count=12
  //where "," separates the sort attributes
  //while "+" separtes the field used for the sort and the sorting value
  if (order_by) {
    const sortQuery = { publishedAt: -1 };

    const sortAttributes = order_by.split(",");
    console.log(sortAttributes)
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
    console.log(sortQuery)
  }

  try {
    //check if only one else set agrregation pipeline to achieve and filtering
    const post = await Post.find({ $or: findQuery, state: "published" })
      .skip(page * limit || page * 20)
      .limit(limit || 20)
      // .sort(sortQuery)
      // .select({ __v: false });
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
  //seperate tags(coming as strings) into array
  req.body.tags = req.body.tags.replace(/\s/g, "").split(",");
  const newPost = req.body;

  //calculate reading time
  const reading_time = await readingTime(newPost.body);
  newPost.readingTime = reading_time;

  try {
    const postCreatedBy = await User.findOne({ _id: req.user._id }).select({
      password: false,
      __v: false,
    });
    newPost.author = postCreatedBy;
    await Post.create(newPost);
    // const newUser = await User.updateOne(
    //   { _id: req.user._id },
    //   { $set: { posts: post._id } }
    // );
    res.status(201).json({
      message: "post created successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPosts,
  createPost,
};
