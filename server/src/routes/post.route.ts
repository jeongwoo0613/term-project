import { Router } from "express";
import { verifyToken } from "../controllers/auth.controller";
import { coinById } from "../controllers/coin.controller";
import {
  commentById,
  createComment,
  deleteComment,
  updateComment,
} from "../controllers/comment.controller";
import {
  createPost,
  deletePost,
  getPosts,
  getPost,
  postById,
  updatePost,
} from "../controllers/post.controller";
import { validatePost } from "../validations/post.validation";
import { validateComment } from "../validations/comment.validation";

const router = Router();

router.param("coinId", coinById);
router.param("postId", postById);
router.param("commentId", commentById);

router.route("/:coinId/post").post(verifyToken, validatePost, createPost);
router.route("/:coinId/posts").get(getPosts);
router
  .route("/:coinId/posts/:postId")
  .get(getPost)
  .put(verifyToken, validatePost, updatePost)
  .delete(verifyToken, deletePost);
router
  .route("/:coinId/posts/:postId/comment")
  .post(verifyToken, validateComment, createComment);
router
  .route("/:coinId/posts/:postId/comments/:commentId")
  .put(verifyToken, validateComment, updateComment)
  .delete(verifyToken, deleteComment);

export default router;
