import { Router } from "express";
import {
  addInterestCoin,
  coinById,
  deleteInterestCoin,
  getCoin,
  getCoins,
  verifyToken,
} from "../controllers";
import { validateInterestCoin } from "../validations";

const router = Router();

router.param("coinId", coinById);

router.route("/coins").get(getCoins);
router.route("/coins/:coinId").get(getCoin);
router
  .route("/coins/:coinId/interest")
  .put(verifyToken, validateInterestCoin, addInterestCoin);
router
  .route("/coins/:coinId/uninterest")
  .put(verifyToken, validateInterestCoin, deleteInterestCoin);

export default router;
