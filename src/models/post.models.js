const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
(options = {
  separator: "-",
  truncate: 120,
}),
  mongoose.plugin(slug, options);

const PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },

  title: {
    type: String,
    max: 75,
  },
  description: {
    type: String,
    max: 255,
  },
  tags: [String],
  category: [
    {
      type: String,
    },
  ],
  body: {
    type: String,
  },
  readCount: {
    type: Number,
    default: 0,
  },
  readingTime: {
    type: Number,
  },
  state: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  publishedAt: {
    type: Date,
  },
  slug: {
    type: String,
    slug: "title",
    unique: true,
  },
});

module.exports = mongoose.model("Posts", PostSchema);
