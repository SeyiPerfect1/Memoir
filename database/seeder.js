const mongoose = require("mongoose");
const { connectToMongoDB } = require("../src/config/dbConfig");
require("dotenv").config();
mongoose.Promise = require("bluebird");
mongoose.connect(process.env.MONGODB_URI);
// const posts = require("./stubs/posts");
// const users = require("./stubs/users");

// const Posts = require('../src/models/post.models');
// const User = require("../src/models/user.models");

// Posts.collection.drop();
// Event.collection.drop();

Posts.create(posts)
  .then((user) => {
    console.log(`${user.length} users created`);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
