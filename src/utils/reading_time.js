//  reading time is estimated to be 130wpm(words per minutes) averagely
/*
@{params} string
@{return} Number
**/
const readingTime = async (post) => {
  const wordCount = post.split(' ').length;
  const totalTime = (wordCount * 1) / 130;
  return `${Math.ceil(totalTime)}`;
};

module.exports = readingTime;
