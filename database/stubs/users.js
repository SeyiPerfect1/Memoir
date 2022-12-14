const { isObjectIdOrHexString } = require("mongoose");

const users = [
  {
    _id: ObjectId("6367116e679244141511f084"),
    firstname: "userA",
    lastname: "userZ",
    username: "user1",
    email: "user1@mail.com",
    password: "Password0!",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: "635eccc34dc4ea83291cf8dc",
    firstname: "userB",
    lastname: "userY",
    username: "user2",
    email: "user2@mail.com",
    password: "Password0!",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: "635eccc24dc4ea83291cf8d8",
    firstname: "userC",
    lastname: "userX",
    username: "user3",
    email: "user3@mail.com",
    password: "Password0!",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    firstname: "userD",
    lastname: "userW",
    username: "user4",
    email: "user4@mail.com",
    password: "Password0!",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    firstname: "userE",
    lastname: "userV",
    username: "user5",
    email: "user5@mail.com",
    password: "Password0!",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: ObjectId("6367116e679244141511f089"),
    firstname: "userF",
    lastname: "userU",
    username: "user6",
    email: "user6@mail.com",
    password: "Password0!",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

module.exports = users;
