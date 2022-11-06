const User = require("../models/user.models");
const Post = require("../models/post.models");

//function to retrieve details of a specific user
const getUserDetails = async (req, res, next) => {
  const { state } = req.query;
  const { username } = req.params;
  try {
    const user = await User.findOne({ username: username }).select({
      password: false,
      __v: false,
      posts: false,
      _id: false,
      id: false,
    });
    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
    }

    if (user.email === req.user.email) {
      const filter = { "author.username": username };
      if (state) {
        filter.state = state;
      }
      console.log(filter);
      const posts = await Post.find(filter);
      res.status(200).json({
        message: `${username} has ${posts.length} post(s)`,
        post: posts,
      });
    } else {
      const posts = await Post.find({
        "author.username": username,
        state: "published",
      });
      res.status(200).json({
        message: `${username} has ${posts.length} post(s)`,
        post: posts,
      });
    }
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  const userDetails = req.body;
  //take in user's new update and add it to a new object
  //exclude password and email in case the user added it as input
  //password and email update require special methods
  const newDetails = {};
  for (const detail in userDetails) {
    if (detail != "email" && detail != "password" && detail != "posts") {
      newDetails[detail] = userDetails[detail];
    }
  }
  newDetails.updatedAt = Date.now();
  try {
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { $set: newDetails },
      { new: true }
    ).select({ password: false, __v: false });
    res.status(200).json({
      message: "user details updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

//delte account
const deleteUser = async (req, res, next) => {
  try {
    await User.findOneAndDelete({ email: req.user.email });
    res.status(200).json({
      message: "user deleted successfuly",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserDetails,
  updateUser,
  deleteUser,
};
