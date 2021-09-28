"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const utils_1 = require("../utils");
const router = (0, express_1.Router)();
router.param("userId", controllers_1.userByUserId);
router.route("/users").get(controllers_1.getUsers);
router.route("/users/:userId").get(controllers_1.getUserByUserId);
router
    .route("/user")
    .get(controllers_1.verifyToken, controllers_1.getUser)
    .put(controllers_1.verifyToken, controllers_1.updateUser)
    .delete(controllers_1.verifyToken, controllers_1.deleteUser);
router
    .route("/user/image")
    .put(controllers_1.verifyToken, utils_1.uploadUserImage.single("userImage"), controllers_1.updateUserImage);
router.route("/user/follow").put(controllers_1.verifyToken, controllers_1.addFollow);
router.route("/user/unfollow").put(controllers_1.verifyToken, controllers_1.deleteFollow);
exports.default = router;
