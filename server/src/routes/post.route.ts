import { Router } from "express";
import { verifyToken } from "../controllers/auth.controller";
import { coinById } from "../controllers/coin.controller";
import {
  createPost,
  getPost,
  getPosts,
  postById,
} from "../controllers/post.controller";

const router = Router();

router.param("coinId", coinById);
router.param("postId", postById);

router.route("/:coinId/post").post(verifyToken, createPost);

router.route("/:coinId/posts").get(getPosts);
router.route("/:coinId/posts/:postId").get(getPost);

export default router;
