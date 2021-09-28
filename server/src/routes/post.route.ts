import { Router } from "express";
import {
  commentById,
  createComment,
  deleteComment,
  updateComment,
  createPost,
  deletePost,
  getPosts,
  getPost,
  postById,
  updatePost,
  verifyToken,
  coinById,
} from "../controllers";
import { validatePost, validateComment } from "../validations";

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
