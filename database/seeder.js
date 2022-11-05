const mongoose = require("mongoose");
const { connectToMongoDB } = require("../src/config/dbConfig");
mongoose.Promise = require("bluebird");
mongoose.connect(
  "mongodb+srv://Oluperfect1:Oluperfect1@cluster0.nljyju0.mongodb.net/Memoir?retryWrites=true&w=majority"
);
// const posts = require("./stubs/posts");
const users = require("./stubs/users");

// const Posts = require('../src/models/post.models');
const User = require("../src/models/user.models");

User.collection.drop();
// Event.collection.drop();

User.create(users)
  .then((user) => {
    console.log(`${user.length} users created`);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
