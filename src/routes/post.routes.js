const express = require("express");
const passport = require("passport");
const postController = require("../controllers/post.controllers");

const postRouter = express.Router();

postRouter.get("/", postController.getPosts);

//router to get a specific post by supplying post slug or id
postRouter.get("/:slug", postController.getPost);

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

postRouter.delete(
  "/:slug",
  passport.authenticate("jwt", { session: false }),
  postController.deletePost
);

module.exports = postRouter;
