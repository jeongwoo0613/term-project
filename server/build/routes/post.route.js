"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const validations_1 = require("../validations");
const router = (0, express_1.Router)();
router.param("coinId", controllers_1.coinById);
router.param("postId", controllers_1.postById);
router.param("commentId", controllers_1.commentById);
router.route("/:coinId/post").post(controllers_1.verifyToken, validations_1.validatePost, controllers_1.createPost);
router.route("/:coinId/posts").get(controllers_1.getPosts);
router
    .route("/:coinId/posts/:postId")
    .get(controllers_1.getPost)
    .put(controllers_1.verifyToken, validations_1.validatePost, controllers_1.updatePost)
    .delete(controllers_1.verifyToken, controllers_1.deletePost);
router
    .route("/:coinId/posts/:postId/comment")
    .post(controllers_1.verifyToken, validations_1.validateComment, controllers_1.createComment);
router
    .route("/:coinId/posts/:postId/comments/:commentId")
    .put(controllers_1.verifyToken, validations_1.validateComment, controllers_1.updateComment)
    .delete(controllers_1.verifyToken, controllers_1.deleteComment);
exports.default = router;
