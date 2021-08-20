"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const coin_controller_1 = require("../controllers/coin.controller");
const post_controller_1 = require("../controllers/post.controller");
const router = express_1.Router();
router.param("coinId", coin_controller_1.coinById);
router.param("postId", post_controller_1.postById);
router.route("/:coinId/post").post(auth_controller_1.verifyToken, post_controller_1.createPost);
router.route("/:coinId/posts").get(post_controller_1.getPosts);
router
    .route("/:coinId/posts/:postId")
    .get(post_controller_1.getPost)
    .put(auth_controller_1.verifyToken, post_controller_1.updatePost)
    .delete(auth_controller_1.verifyToken, post_controller_1.deletePost);
exports.default = router;
