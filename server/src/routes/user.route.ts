import { Router } from "express";
import {
  userByUserId,
  getUsers,
  getUserByUserId,
  getUser,
  updateUser,
  deleteUser,
  updateUserImage,
  addFollow,
  deleteFollow,
  verifyToken,
} from "../controllers";
import { uploadUserImage } from "../utils";

const router = Router();

router.param("userId", userByUserId);

router.route("/users").get(getUsers);
router.route("/users/:userId").get(getUserByUserId);
router
  .route("/user")
  .get(verifyToken, getUser)
  .put(verifyToken, updateUser)
  .delete(verifyToken, deleteUser);
router
  .route("/user/image")
  .put(verifyToken, uploadUserImage.single("userImage"), updateUserImage);
router.route("/user/follow").put(verifyToken, addFollow);
router.route("/user/unfollow").put(verifyToken, deleteFollow);

export default router;
