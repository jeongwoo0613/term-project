import { Router } from "express";
import {
  verifyAdminAuthorization,
  verifyToken,
} from "../controllers/auth.controller";
import { createCoin, updateCoin } from "../controllers/admin.controller";
import { uploadCoinImage } from "../utils/s3.util";
import { coinById } from "../controllers/coin.controller";

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
