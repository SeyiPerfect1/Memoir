const Comment = require('../../models/comment.models');
const dayjs = require('dayjs');
const { NotFoundError } = require('../../lib/errors/index');

async function getManyComments (query) {
  //  destructure query parameters
  const { page, limit, orderBy, postId, start, end } = query;

  //  deduct 1 from the page no before multiplying with the limit value
  //  if page is not provided in query, set to 0
  const pageNO = parseInt(page) - 1 || 1;
  const commentLimit = parseInt(limit) || 20;

  const findQuery = [];
  //  check if author or title or tag is not provided in query params
  //  if none is provided pass in an empty string
  if (!postId) {
    findQuery.push({});
  }
  //  if author is provided as a query params
  //  set the query in an object and push into the findquery array
  if (postId) {
    findQuery.push({ 'post._id': postId });
  }

  //  query where published date is in the range start to end date
  //  where start and end is in the format dd-mm-yyyy
  //  and push to the findQuery array
  if (start && end) {
    const startDate = dayjs(start).format('YYYY-MM-DD');
    const endDate = dayjs(end).format('YYYY-MM-DD');

    findQuery.push({
      publishedAt: {
        $gt: dayjs(startDate).startOf('day'),
        $lt: dayjs(endDate).endOf('day')
      }
    });
  }

  //  sorting posts according to sort query given in query parameter
  //  by default, each query is sorted by publishedDate in descending order
  //  A sample url pattern for the sort query is:
  //  http://myapp.com/books?author+asc&datePublished+desc&title=loremipsum
  //  where "," separates the sort attributes
  //  while "+" separtes the field used for the sort and the sorting value
  const sortQuery = {};

  if (orderBy) {
    const sortAttributes = orderBy.split(',');

    for (const attribute of sortAttributes) {
      const sortField = attribute.split(' ')[0];
      const sortValue = attribute.split(' ')[1];

      if (sortValue === 'asc') {
        sortQuery[sortField] = 1;
        if (sortField === 'publishedAt') {
          sortQuery[sortField] = -1;
        }
      }

      if (sortValue === 'desc') {
        sortQuery[sortField] = -1;
        if (sortField === 'publishedAt') {
          sortQuery[sortField] = 1;
        }
      }
    }
  }

  if (!orderBy) {
    sortQuery.publishedAt = -1;
  }

  const comment = await Comment.find({ $or: findQuery, state: 'published' })
    .skip(pageNO * commentLimit)
    .limit(commentLimit)
    .sort(sortQuery)
    .select({ __v: false });

  if (!comment) {
    throw new NotFoundError('comment(s) not found');
  };

  const totalComment = comment.length;
  const totalPages = commentLimit === 0 ? 1 : (comment.length) / limit;
  const commentProperties = [comment, commentLimit, pageNO, totalComment, totalPages];
  return commentProperties;
}

module.exports = getManyComments;
