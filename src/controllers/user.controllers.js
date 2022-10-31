const User = require("../models/user.models");

//function to retrieve details of a specific user
const userProfile = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const userDetailsUpdate = async (req, res, next) => {
  const userDetails = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { $set: userDetails },
      { new: true }
    );
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  userProfile,
  userDetailsUpdate,
};
