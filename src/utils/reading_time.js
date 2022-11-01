//reading time is estimated to be 130wpm(words per minutes) averagely
const readingTime = (post) => {
    const wordCount = post.split(" ").length
    const totalTime = (wordCount*1)/130
    return totalTime
};

module.exports = readingTime