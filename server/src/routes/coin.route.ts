import { Router } from "express";
import { coinById, getCoin, getCoins } from "../controllers/coin.controller";

const router = Router();

router.param("coinId", coinById);

router.route("/coins").get(getCoins);
router.route("/coins/:coinId").get(getCoin);

export default router;
