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
  const newDetails = {};
  for (const detail in userDetails) {
    if (detail != "email" && detail != "password") {
      newDetails[detail] = userDetails[detail];
    }
  }
  try {
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { $set: newDetails },
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
