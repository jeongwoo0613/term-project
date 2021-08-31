"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const admin_controller_1 = require("../controllers/admin.controller");
const s3_util_1 = require("../utils/s3.util");
const coin_controller_1 = require("../controllers/coin.controller");
const router = (0, express_1.Router)();
router.param("coinId", coin_controller_1.coinById);
router
    .route("/admin/coin")
    .post(auth_controller_1.verifyToken, auth_controller_1.verifyAdminAuthorization, s3_util_1.uploadCoinImage.single("coinImage"), admin_controller_1.createCoin);
router
    .route("/admin/coins/:coinId")
    .put(auth_controller_1.verifyToken, auth_controller_1.verifyAdminAuthorization, admin_controller_1.updateCoin);
exports.default = router;
