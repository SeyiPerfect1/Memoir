//reading time is estimated to be 130wpm(words per minutes) averagely
const readingTime = async (post) => {
  const wordCount = post.split(" ").length;
  const totalTime = (wordCount * 1) / 130;
  return `${ Math.round(totalTime) } min`;
};

module.exports = readingTime;
