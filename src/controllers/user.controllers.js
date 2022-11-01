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
  //take in user's new update and add it to a new object
  //exclude password and email in case the user added it as input
  //password and email update require special methods
  const newDetails = {};
  for (const detail in userDetails) {
    if (detail != "email" && detail != "password") {
      newDetails[detail] = userDetails[detail];
    }
  }
  newDetails.updatedAt = Date.now();
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
