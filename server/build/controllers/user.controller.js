"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFollow = exports.addFollow = exports.updateUserImage = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUserByUserId = exports.getUsers = exports.userByUserId = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const typeorm_1 = require("typeorm");
const entities_1 = require("../entities");
const utils_1 = require("../utils");
const userByUserId = async (req, res, next, id) => {
    try {
        const user = await (0, typeorm_1.getRepository)(entities_1.User).findOne({
            userId: id,
        }, {
            relations: ["following", "followers", "posts", "interests"],
        });
        if (!user) {
            return next((0, http_errors_1.default)(404, "user not found."));
        }
        req.userByUserId = user;
        next();
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "user's id don't match."));
    }
};
exports.userByUserId = userByUserId;
const getUsers = async (req, res, next) => {
    try {
        const users = await (0, typeorm_1.getRepository)(entities_1.User).find({
            userId: (0, typeorm_1.Not)("admin"),
        });
        if (users.length === 0) {
            return next((0, http_errors_1.default)(404, "users not found."));
        }
        users.forEach((user) => {
            user.password = "";
        });
        res.status(200).json(users);
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not get users."));
    }
};
exports.getUsers = getUsers;
const getUserByUserId = async (req, res, next) => {
    try {
        if (req.userByUserId.posts.length > 0) {
            const posts = [];
            for (const post of req.userByUserId.posts) {
                const matchedPost = await (0, typeorm_1.getRepository)(entities_1.Post).findOne(post.id, {
                    relations: ["coin"],
                });
                if (!matchedPost) {
                    return next((0, http_errors_1.default)(404, "post not found."));
                }
                posts.push(matchedPost);
            }
            posts.sort((a, b) => b.id - a.id);
            req.userByUserId.posts = posts;
        }
        req.userByUserId.password = "";
        if (req.userByUserId.followers.length > 0) {
            req.userByUserId.followers.forEach((user) => {
                user.password = "";
            });
        }
        if (req.userByUserId.following.length > 0) {
            req.userByUserId.following.forEach((user) => {
                user.password = "";
            });
        }
        if (req.userByUserId.interests.length > 0) {
            req.userByUserId.interests.sort((a, b) => b.accTradePrice24h - a.accTradePrice24h);
        }
        res.status(200).json(req.userByUserId);
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not get user."));
    }
};
exports.getUserByUserId = getUserByUserId;
const getUser = async (req, res, next) => {
    try {
        if (req.user.posts.length > 0) {
            const posts = [];
            for (const post of req.user.posts) {
                const matchedPost = await (0, typeorm_1.getRepository)(entities_1.Post).findOne(post.id, {
                    relations: ["coin"],
                });
                if (!matchedPost) {
                    return next((0, http_errors_1.default)(404, "post not found."));
                }
                posts.push(matchedPost);
            }
            posts.sort((a, b) => b.id - a.id);
            req.user.posts = posts;
        }
        req.user.password = "";
        if (req.user.followers.length > 0) {
            req.user.followers.forEach((user) => {
                user.password = "";
            });
        }
        if (req.user.following.length > 0) {
            req.user.following.forEach((user) => {
                user.password = "";
            });
        }
        if (req.user.interests.length > 0) {
            req.user.interests.sort((a, b) => b.accTradePrice24h - a.accTradePrice24h);
        }
        res.status(200).json(req.user);
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not get user."));
    }
};
exports.getUser = getUser;
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.user;
        await (0, typeorm_1.getRepository)(entities_1.User).update(id, {
            ...req.body,
        });
        res.status(200).json({
            message: "succeed.",
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not update user."));
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    try {
        const { id, imageKey } = req.user;
        if (imageKey && imageKey !== "userdefault.png") {
            await (0, utils_1.deleteUserImage)(imageKey);
        }
        await (0, typeorm_1.getRepository)(entities_1.User).delete(id);
        res.status(200).json({
            message: "succeed.",
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not delete user."));
    }
};
exports.deleteUser = deleteUser;
const updateUserImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next((0, http_errors_1.default)(400, "could not upload file."));
        }
        const { location, key } = req.file;
        const { id, imageKey } = req.user;
        if (imageKey !== "userdefault.png") {
            (0, utils_1.deleteUserImage)(imageKey);
        }
        await (0, typeorm_1.getRepository)(entities_1.User).update(id, {
            image: location,
            imageKey: key,
        });
        res.status(200).json(location);
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not update image."));
    }
};
exports.updateUserImage = updateUserImage;
const addFollow = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { followingId } = req.body;
        const userRepository = (0, typeorm_1.getRepository)(entities_1.User);
        const currentUser = await userRepository.findOne(id, {
            relations: ["following"],
        });
        if (!currentUser) {
            return next((0, http_errors_1.default)(404, "current user not found."));
        }
        const followingUser = await userRepository.findOne(followingId, {
            relations: ["followers"],
        });
        if (!followingUser) {
            return next((0, http_errors_1.default)(404, "following user not found."));
        }
        const checkFollowingAndFollowers = currentUser.following.some((user) => user.id === followingId) &&
            followingUser.followers.some((user) => user.id === id);
        if (checkFollowingAndFollowers) {
            return next((0, http_errors_1.default)(400, "already following."));
        }
        currentUser.following.push(followingUser);
        await userRepository.save(currentUser);
        followingUser.followers.push(currentUser);
        await userRepository.save(followingUser);
        res.status(200).json({
            message: "succeed.",
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not follow user."));
    }
};
exports.addFollow = addFollow;
const deleteFollow = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { followingId } = req.body;
        const userRepository = (0, typeorm_1.getRepository)(entities_1.User);
        const currentUser = await userRepository.findOne(id, {
            relations: ["following"],
        });
        if (!currentUser) {
            return next((0, http_errors_1.default)(404, "current user not found."));
        }
        const followingUser = await userRepository.findOne(followingId, {
            relations: ["followers"],
        });
        if (!followingUser) {
            return next((0, http_errors_1.default)(404, "following user not found."));
        }
        const checkFollowingAndFollowers = currentUser.following.some((user) => user.id === followingId) &&
            followingUser.followers.some((user) => user.id === id);
        if (!checkFollowingAndFollowers) {
            return next((0, http_errors_1.default)(400, "not following."));
        }
        currentUser.following = currentUser.following.filter((user) => {
            return user.id !== followingId;
        });
        await userRepository.save(currentUser);
        followingUser.followers = followingUser.followers.filter((user) => {
            return user.id !== id;
        });
        await userRepository.save(followingUser);
        res.status(200).json({
            message: "succeed.",
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not unfollow user."));
    }
};
exports.deleteFollow = deleteFollow;
