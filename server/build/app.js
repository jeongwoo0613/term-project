"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const coin_route_1 = __importDefault(require("./routes/coin.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const passport_config_1 = require("./configs/passport.config");
const app = express_1.default();
if (process.env.NODE_ENV === "production") {
    app.use(helmet_1.default());
    app.use(compression_1.default());
    app.use(morgan_1.default("combined"));
}
else {
    app.use(morgan_1.default("dev"));
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cors_1.default());
app.use(passport_1.default.initialize());
passport_1.default.use(passport_config_1.jwtStrategy);
passport_1.default.use(passport_config_1.googleStrategy);
app.use("/api", auth_route_1.default);
app.use("/api", user_route_1.default);
app.use("/api", coin_route_1.default);
app.use("/api", post_route_1.default);
app.use("/api", admin_route_1.default);
app.use((err, req, res, next) => {
    res.status(400).json({
        code: 400,
        error: err.message,
    });
});
exports.default = app;
