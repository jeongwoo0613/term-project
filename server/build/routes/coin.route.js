"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const coin_controller_1 = require("../controllers/coin.controller");
const interest_validation_1 = require("../validations/interest.validation");
const router = (0, express_1.Router)();
router.param("coinId", coin_controller_1.coinById);
router.route("/coins").get(coin_controller_1.getCoins);
router.route("/coins/:coinId").get(coin_controller_1.getCoin);
router
    .route("/coins/:coinId/interest")
    .put(auth_controller_1.verifyToken, interest_validation_1.validateInterestCoin, coin_controller_1.addInterestCoin);
router
    .route("/coins/:coinId/uninterest")
    .put(auth_controller_1.verifyToken, interest_validation_1.validateInterestCoin, coin_controller_1.deleteInterestCoin);
exports.default = router;
