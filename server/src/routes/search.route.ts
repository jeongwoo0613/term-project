import { Router } from "express";
import { searchCoin } from "../controllers";

const router = Router();

router.route("/search").get(searchCoin);

export default router;
