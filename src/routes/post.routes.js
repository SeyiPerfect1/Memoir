const express = require("express");
const passport = require("passport");
const postController = require("../controllers/post.controllers");

const postRouter = express.Router();

postRouter.get("/", postController.getPosts);

postRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postController.createPost
);
