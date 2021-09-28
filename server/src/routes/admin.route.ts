import { Router } from "express";
import {
  verifyAdminAuthorization,
  verifyToken,
  createCoin,
  updateCoin,
  coinById,
} from "../controllers";
import { uploadCoinImage } from "../utils";

const router = Router();

router.param("coinId", coinById);

router
  .route("/admin/coin")
  .post(
    verifyToken,
    verifyAdminAuthorization,
    uploadCoinImage.single("coinImage"),
    createCoin
  );
router
  .route("/admin/coins/:coinId")
  .put(verifyToken, verifyAdminAuthorization, updateCoin);

export default router;
