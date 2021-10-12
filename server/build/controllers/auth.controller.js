"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminAuthorization = exports.succeedAuthGoogle = exports.authGoogle = exports.verifyGoogle = exports.verifyToken = exports.login = exports.signup = void 0;
const passport_1 = __importDefault(require("passport"));
const http_errors_1 = __importDefault(require("http-errors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const typeorm_1 = require("typeorm");
const entities_1 = require("../entities");
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyToken = passport_1.default.authenticate("jwt", { session: false });
exports.verifyToken = verifyToken;
const verifyGoogle = passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
});
exports.verifyGoogle = verifyGoogle;
const authGoogle = passport_1.default.authenticate("google", {
    session: false,
    // TODO: seperate production and development environment
    failureRedirect: "http://localhost:3000/login",
});
exports.authGoogle = authGoogle;
const succeedAuthGoogle = (req, res) => {
    const user = JSON.stringify(req.user);
    const token = (0, jsonwebtoken_1.sign)({
        id: req.user.id,
    }, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "30d",
    });
    // TODO: seperate production and development environment
    res.redirect(`http://localhost:3000/login?token=${token}&user=${user}`);
};
exports.succeedAuthGoogle = succeedAuthGoogle;
const verifyAdminAuthorization = (req, res, next) => {
    const authorized = req.user.userId === "admin";
    if (!authorized) {
        return next((0, http_errors_1.default)(401, "not authorized."));
    }
    next();
};
exports.verifyAdminAuthorization = verifyAdminAuthorization;
const signup = async (req, res, next) => {
    try {
        const { userId, password, nickname } = req.body;
        const userRepository = (0, typeorm_1.getRepository)(entities_1.User);
        const user = await userRepository.findOne({ userId });
        if (user) {
            return next((0, http_errors_1.default)(400, "user already exist."));
        }
        const newUser = new entities_1.User();
        const saltRounds = 10;
        newUser.userId = userId;
        newUser.password = await bcrypt_1.default.hash(password, saltRounds);
        newUser.nickname = nickname;
        newUser.image =
            "https://term-project-default.s3.ap-northeast-2.amazonaws.com/userdefault.png";
        newUser.imageKey = "userdefault.png";
        await userRepository.insert(newUser);
        res.status(201).json({
            message: "succeed.",
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not signup."));
    }
};
exports.signup = signup;
const login = async (req, res, next) => {
    try {
        const { userId, password } = req.body;
        const user = await (0, typeorm_1.getRepository)(entities_1.User).findOne({ userId });
        if (!user) {
            return next((0, http_errors_1.default)(404, "user not found."));
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return next((0, http_errors_1.default)(400, "password don't match."));
        }
        const token = (0, jsonwebtoken_1.sign)({
            id: user.id,
        }, process.env.JWT_SECRET, {
            algorithm: "HS256",
            expiresIn: "30d",
        });
        user.password = "";
        res.status(200).json({
            token,
            user,
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not login."));
    }
};
exports.login = login;
