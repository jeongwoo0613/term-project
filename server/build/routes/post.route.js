"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const coin_controller_1 = require("../controllers/coin.controller");
const comment_controller_1 = require("../controllers/comment.controller");
const post_controller_1 = require("../controllers/post.controller");
const post_validation_1 = require("../validations/post.validation");
const comment_validation_1 = require("../validations/comment.validation");
const router = (0, express_1.Router)();
router.param("coinId", coin_controller_1.coinById);
router.param("postId", post_controller_1.postById);
router.param("commentId", comment_controller_1.commentById);
router.route("/:coinId/post").post(auth_controller_1.verifyToken, post_validation_1.validatePost, post_controller_1.createPost);
router.route("/:coinId/posts").get(post_controller_1.getPosts);
router
    .route("/:coinId/posts/:postId")
    .get(post_controller_1.getPost)
    .put(auth_controller_1.verifyToken, post_validation_1.validatePost, post_controller_1.updatePost)
    .delete(auth_controller_1.verifyToken, post_controller_1.deletePost);
router
    .route("/:coinId/posts/:postId/comment")
    .post(auth_controller_1.verifyToken, comment_validation_1.validateComment, comment_controller_1.createComment);
router
    .route("/:coinId/posts/:postId/comments/:commentId")
    .put(auth_controller_1.verifyToken, comment_validation_1.validateComment, comment_controller_1.updateComment)
    .delete(auth_controller_1.verifyToken, comment_controller_1.deleteComment);
exports.default = router;
