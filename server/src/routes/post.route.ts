import { Router } from "express";
import { verifyToken } from "../controllers/auth.controller";
import { coinById } from "../controllers/coin.controller";
import {
  createPost,
  deletePost,
  getPosts,
  getPost,
  getCoinPosts,
  getCoinPost,
  postById,
  updatePost,
} from "../controllers/post.controller";

const router = Router();

router.param("coinId", coinById);
router.param("postId", postById);

router.route("/posts").get(getPosts);
router.route("/posts/:postId").get(getPost);

router.route("/:coinId/post").post(verifyToken, createPost);

router.route("/:coinId/posts").get(getCoinPosts);
router
  .route("/:coinId/posts/:postId")
  .get(getCoinPost)
  .put(verifyToken, updatePost)
  .delete(verifyToken, deletePost);

export default router;
