"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const validations_1 = require("../validations");
const router = (0, express_1.Router)();
router.param("coinId", controllers_1.coinById);
router.route("/coins").get(controllers_1.getCoins);
router.route("/coins/:coinId").get(controllers_1.getCoin);
router
    .route("/coins/:coinId/interest")
    .put(controllers_1.verifyToken, validations_1.validateInterestCoin, controllers_1.addInterestCoin);
router
    .route("/coins/:coinId/uninterest")
    .put(controllers_1.verifyToken, validations_1.validateInterestCoin, controllers_1.deleteInterestCoin);
exports.default = router;
