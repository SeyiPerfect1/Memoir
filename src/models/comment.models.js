const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('../models/user.models');

const CommentSchema = new Schema({
  author: {},
  post: {},
  body: {
    type: String,
    required: true
  },
  state: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comments', CommentSchema);
