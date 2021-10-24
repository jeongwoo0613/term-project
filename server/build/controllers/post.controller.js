"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getPost = exports.getPosts = exports.createPost = exports.postById = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const typeorm_1 = require("typeorm");
const entities_1 = require("../entities");
const postById = async (req, res, next, id) => {
    try {
        const post = await (0, typeorm_1.getRepository)(entities_1.Post).findOne(id);
        if (!post) {
            return next((0, http_errors_1.default)(404, "post not found."));
        }
        req.post = post;
        next();
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "post's id don't match."));
    }
};
exports.postById = postById;
const createPost = async (req, res, next) => {
    try {
        const { title, content, rise, fall } = req.body;
        const postRepository = (0, typeorm_1.getRepository)(entities_1.Post);
        const userRepository = (0, typeorm_1.getRepository)(entities_1.User);
        const coinRepository = (0, typeorm_1.getRepository)(entities_1.Coin);
        const post = new entities_1.Post();
        post.title = title;
        post.content = content;
        post.rise = rise;
        post.fall = fall;
        await postRepository.insert(post);
        const user = await userRepository.findOne(req.user.id, {
            relations: ["posts"],
        });
        if (!user) {
            return next((0, http_errors_1.default)(404, "user not found."));
        }
        const coin = await coinRepository.findOne(req.coin.id, {
            relations: ["posts"],
        });
        if (!coin) {
            return next((0, http_errors_1.default)(404, "coin not found."));
        }
        user.posts.push(post);
        await userRepository.save(user);
        coin.posts.push(post);
        await coinRepository.save(coin);
        res.status(201).json({
            message: "succeed.",
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not create post."));
    }
};
exports.createPost = createPost;
const getPosts = async (req, res, next) => {
    try {
        const posts = [];
        if (req.coin.posts.length > 0) {
            for (const post of req.coin.posts) {
                const matchedPost = await (0, typeorm_1.getRepository)(entities_1.Post).findOne(post.id, {
                    relations: ["user", "coin"],
                });
                if (!matchedPost) {
                    return next((0, http_errors_1.default)(404, "post not found."));
                }
                matchedPost.user.password = "";
                posts.push(matchedPost);
            }
            posts.sort((a, b) => b.id - a.id);
        }
        res.status(200).json(posts);
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not get posts."));
    }
};
exports.getPosts = getPosts;
const getPost = async (req, res, next) => {
    try {
        const matchedPost = req.coin.posts.find((post) => post.id === req.post.id);
        if (!matchedPost) {
            return next((0, http_errors_1.default)(404, "post not found."));
        }
        const post = await (0, typeorm_1.getRepository)(entities_1.Post).findOne(matchedPost.id, {
            relations: ["user", "coin", "comments"],
        });
        if (!post) {
            return next((0, http_errors_1.default)(404, "post not found."));
        }
        post.user.password = "";
        const comments = [];
        for (const comment of post.comments) {
            const matchedComment = await (0, typeorm_1.getRepository)(entities_1.Comment).findOne(comment.id, {
                relations: ["user"],
            });
            if (!matchedComment) {
                return next((0, http_errors_1.default)(404, "comment not found."));
            }
            matchedComment.user.password = "";
            comments.push(matchedComment);
        }
        post.comments = comments;
        res.status(200).json(post);
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not get post."));
    }
};
exports.getPost = getPost;
const updatePost = async (req, res, next) => {
    try {
        const { id } = req.post;
        await (0, typeorm_1.getRepository)(entities_1.Post).update(id, {
            ...req.body,
        });
        res.status(200).json({
            message: "succeed.",
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not update post."));
    }
};
exports.updatePost = updatePost;
const deletePost = async (req, res, next) => {
    try {
        const { id } = req.post;
        if (req.post.user.id !== req.user.id) {
            return next((0, http_errors_1.default)(400, "post's user id and request user id don't match."));
        }
        await (0, typeorm_1.getRepository)(entities_1.Post).delete(id);
        res.status(200).json({
            message: "succeed.",
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not delete post."));
    }
};
exports.deletePost = deletePost;
