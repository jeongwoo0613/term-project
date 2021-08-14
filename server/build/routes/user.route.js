"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const user_controller_1 = require("../controllers/user.controller");
const s3_util_1 = require("../utils/s3.util");
const router = express_1.Router();
router.param("userId", user_controller_1.userByUserId);
router.route("/users").get(user_controller_1.getUsers);
router.route("/users/:userId").get(user_controller_1.getUserByUserId);
router
    .route("/user")
    .get(auth_controller_1.verifyToken, user_controller_1.getUser)
    .put(auth_controller_1.verifyToken, user_controller_1.updateUser)
    .delete(auth_controller_1.verifyToken, user_controller_1.deleteUser);
router
    .route("/user/image")
    .put(auth_controller_1.verifyToken, s3_util_1.uploadUserImage.single("userImage"), user_controller_1.updateUserImage);
router.route("/user/follow").put(auth_controller_1.verifyToken, user_controller_1.addFollow);
router.route("/user/unfollow").put(auth_controller_1.verifyToken, user_controller_1.deleteFollow);
exports.default = router;
