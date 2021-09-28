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
const routes_1 = require("./routes");
const configs_1 = require("./configs");
const app = (0, express_1.default)();
if (process.env.NODE_ENV === "production") {
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, morgan_1.default)("combined"));
}
else {
    app.use((0, morgan_1.default)("dev"));
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use(passport_1.default.initialize());
passport_1.default.use(configs_1.jwtStrategy);
passport_1.default.use(configs_1.googleStrategy);
app.use("/api", routes_1.auth);
app.use("/api", routes_1.user);
app.use("/api", routes_1.coin);
app.use("/api", routes_1.post);
app.use("/api", routes_1.admin);
app.use("/api", routes_1.search);
app.use(configs_1.errorLogger);
app.use(configs_1.errorHandler);
exports.default = app;
