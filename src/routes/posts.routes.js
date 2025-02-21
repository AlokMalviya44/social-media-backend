import { Router } from "express";
import * as postController from "../controllers/post.controller.js";
import * as postMiddleware from "../middlewares/post.middleware.js";
import * as userMiddleware from "..//middlewares/user.middleware.js";
const router = Router();

router.post(
  "/create",
  userMiddleware.authUser,
  postMiddleware.handleFileUpload,
  postController.createPost
);

router.get("/get-recent", userMiddleware.authUser, postController.getAllPosts);

router.get("/get/:postId", userMiddleware.authUser, postController.getPost);

router.patch("/like/:postId", userMiddleware.authUser, postController.likePost);

router.patch(
  "/remove-like/:postId",
  userMiddleware.authUser,
  postController.removeLikePost
);

router.post(
  "/comment",
  userMiddleware.authUser,
  postMiddleware.validateComment,
  postController.commentOnPost
);

export default router;
