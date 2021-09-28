"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.admin = exports.coin = exports.post = exports.user = exports.auth = void 0;
var auth_route_1 = require("./auth.route");
Object.defineProperty(exports, "auth", { enumerable: true, get: function () { return __importDefault(auth_route_1).default; } });
var user_route_1 = require("./user.route");
Object.defineProperty(exports, "user", { enumerable: true, get: function () { return __importDefault(user_route_1).default; } });
var post_route_1 = require("./post.route");
Object.defineProperty(exports, "post", { enumerable: true, get: function () { return __importDefault(post_route_1).default; } });
var coin_route_1 = require("./coin.route");
Object.defineProperty(exports, "coin", { enumerable: true, get: function () { return __importDefault(coin_route_1).default; } });
var admin_route_1 = require("./admin.route");
Object.defineProperty(exports, "admin", { enumerable: true, get: function () { return __importDefault(admin_route_1).default; } });
var search_route_1 = require("./search.route");
Object.defineProperty(exports, "search", { enumerable: true, get: function () { return __importDefault(search_route_1).default; } });
