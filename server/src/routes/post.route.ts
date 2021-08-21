import { Router } from "express";
import { verifyToken } from "../controllers/auth.controller";
import { coinById } from "../controllers/coin.controller";
import {
  createPost,
  deletePost,
  getPosts,
  getPost,
  postById,
  updatePost,
} from "../controllers/post.controller";

const router = Router();

router.param("coinId", coinById);
router.param("postId", postById);

router.route("/:coinId/post").post(verifyToken, createPost);

router.route("/:coinId/posts").get(getPosts);
router
  .route("/:coinId/posts/:postId")
  .get(getPost)
  .put(verifyToken, updatePost)
  .delete(verifyToken, deletePost);

export default router;
