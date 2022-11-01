const Post = require("../models/post.models");
const dayjs = require("dayjs");

const getPost = async (req, res, next) => {
  const { page, limit, order_by, tags, title, author, start, end } = req.query;

  const findQuery = [];
  if (author) {
    findQuery.push({ author: author.username });
  }

  if (title) {
    findQuery.push({ title: title });
  }

  if (tags) {
    const tagQuery = tags.split("+");
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
    const sortQuery = {};

    const sortAttributes = order_by.split(",");

    for (const attribute of sortAttributes) {
      const sortField = attribute.split("+")[0];
      const sortValue = attribute.split("+")[1];
      if (sortValue === "asc") {
        sortQuery[sortField] = 1;
      }

      if (sortValue === "desc") {
        sortQuery[sortField] = -1;
      }
    }
  }

  try {
    const post = await Post.find({ $or: findQuery, state: published })
      .skip(page * limit || page * 20)
      .limit(limit || 20)
      .sort({ sortQuery } || { publishedAt: -1 });
    res.status(200).json({
      message: post,
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
    getPost
}
