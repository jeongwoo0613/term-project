"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleStrategy = exports.jwtStrategy = void 0;
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const uuid_1 = require("uuid");
const opts = {
    jwtFromRequest: passport_jwt_1.default.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    algorithms: ["HS256"],
};
const jwtStrategy = new passport_jwt_1.default.Strategy(opts, async (jwt_payload, done) => {
    try {
        const user = await (0, typeorm_1.getRepository)(user_entity_1.User).findOne({ id: jwt_payload.id }, {
            relations: ["following", "followers", "posts", "interests"],
        });
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    }
    catch (error) {
        return done(error, false);
    }
});
exports.jwtStrategy = jwtStrategy;
const googleStrategy = new passport_google_oauth20_1.default.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const userRepository = (0, typeorm_1.getRepository)(user_entity_1.User);
        const user = await userRepository.findOne({ googleId: profile.id }, {
            relations: ["following", "followers", "posts", "interests"],
        });
        if (user) {
            return done(null, user);
        }
        const { id, displayName, emails, photos } = profile;
        const email = emails ?? [{ value: "" }];
        const image = photos ?? [
            {
                value: "https://term-project-default.s3.ap-northeast-2.amazonaws.com/userdefault.png",
            },
        ];
        const newUser = new user_entity_1.User();
        newUser.googleId = id;
        newUser.facebookId = "";
        newUser.nickname = displayName;
        newUser.email = email[0].value;
        newUser.image = image[0].value;
        if (image[0].value ===
            "https://term-project-default.s3.ap-northeast-2.amazonaws.com/userdefault.png") {
            newUser.imageKey = "userdefault.png";
        }
        else {
            newUser.imageKey = "";
        }
        newUser.userId = (0, uuid_1.v4)()
            .replace(/[^0-9a-z]/g, "")
            .substring(0, 17);
        newUser.password = "";
        newUser.salt = "";
        await userRepository.insert(newUser);
        return done(null, newUser);
    }
    catch (error) {
        return done(error, false);
    }
});
exports.googleStrategy = googleStrategy;
