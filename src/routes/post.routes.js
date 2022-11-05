const express = require("express");
const passport = require("passport");
const postController = require("../controllers/post.controllers");

const postRouter = express.Router();


postRouter.get("/:slug", postController.getPosts);

postRouter.get("/", postController.getPost);

postRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postController.createPost
);

postRouter.put(
  "/:slug",
  passport.authenticate("jwt", { session: false }),
  postController.updatePost
);

module.exports = postRouter;
