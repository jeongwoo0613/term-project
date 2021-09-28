"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const utils_1 = require("../utils");
const router = (0, express_1.Router)();
router.param("coinId", controllers_1.coinById);
router
    .route("/admin/coin")
    .post(controllers_1.verifyToken, controllers_1.verifyAdminAuthorization, utils_1.uploadCoinImage.single("coinImage"), controllers_1.createCoin);
router
    .route("/admin/coins/:coinId")
    .put(controllers_1.verifyToken, controllers_1.verifyAdminAuthorization, controllers_1.updateCoin);
exports.default = router;
