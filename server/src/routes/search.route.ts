import { Router } from "express";
import { searchCoin } from "../controllers/search.controller";

const router = Router();

router.route("/search").get(searchCoin);

export default router;
