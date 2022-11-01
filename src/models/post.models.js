const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("../models/user.models")
const slug = require("mongoose-slug-generator");
const options = {
  separator: "-",
  truncate: 120,
};
  mongoose.plugin(slug, options);

const PostSchema = new Schema({
  author: {},
  title: {
    type: String,
    max: 75,
    required: true
  },
  description: {
    type: String,
    max: 255,
  },
  tags: [String],
  body: {
    type: String,
    required: true
  },
  readCount: {
    type: Number,
    default: 0,
  },
  readingTime: {
    type: String,
    required: true
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
    slug: ["title", "_id"],
    unique: true,
  },
});

module.exports = mongoose.model("Posts", PostSchema);
// schema.pre('save', function (next, req) {
//   var Doctors = mongoose.model('Doctors'); //--> add this line
//   Doctors.findOne({email:req.body.email}, function (err, found) {
//     if (found) return next();
//     else return next(new Error({error:"not found"}));
//   });
// });
