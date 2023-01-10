const Post = require('../../models/post.models');
const dayjs = require('dayjs');
const { NotFoundError } = require('../../lib/errors/index');

async function getManyPosts (query) {
  //  destructure query parameters
  const { page, limit, id, orderBy, tags, title, author, start, end } = query;

  //  deduct 1 from the page no before multiplying with the limit value
  //  if page is not provided in query, set to 0
  const pageNO = parseInt(page) || 1;
  const postLimit = parseInt(limit) || 20;

  const findQuery = [];
  //  check if author or title or tag is not provided in query params
  //  if none is provided pass in an empty string
  if (!author && !title && !tags && !id) {
    findQuery.push({});
  }
  //  if author is provided as a query params
  //  set the query in an object and push into the findquery array
  if (author) {
    findQuery.push({ 'author.username': author });
  }

  //  check for id
  if (id) {
    findQuery.push({ id: { $regex: `${id}`, $options: 'i' } });
  }

  //  if title is provided as a query params
  //  set the query to match the title as a regex in an object
  //  and push into the findquery array
  if (title) {
    findQuery.push({ title: { $regex: `${title}`, $options: 'i' } });
  }

  //  if tags is/are provided as a query params
  //  set the query to match document that match one/more of the tag(s) in an object
  //  and push into the findquery array
  //  tags should be separated by space or mysql standard '+' in the url
  if (tags) {
    const tagQuery = tags.split(' ');
    findQuery.push({ tags: { $in: tagQuery } });
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

  const post = await Post.find({ $or: findQuery, state: 'published' })
    .skip((pageNO - 1) * postLimit)
    .limit(postLimit)
    .sort(sortQuery)
    .select({ __v: false });

  if (!post) {
    throw new NotFoundError('post(s) not found');
  };

  if (post.length === 0) {
    const postProperties = { post: '0 post(s) found' };
    return postProperties;
  };

  // const totalPosts = post.length;
  // const totalPages = postLimit === 0 ? 1 : (totalPosts) / limit;
  const postProperties = { post, postLimit, pageNO };
  return postProperties;
}

module.exports = getManyPosts;
