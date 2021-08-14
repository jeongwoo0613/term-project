"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coin_controller_1 = require("../controllers/coin.controller");
const router = express_1.Router();
router.param("coinId", coin_controller_1.coinById);
router.route("/coins").get(coin_controller_1.getCoins);
router.route("/coins/:coinId").get(coin_controller_1.getCoin);
exports.default = router;
