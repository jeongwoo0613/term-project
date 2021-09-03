"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getPost = exports.getPosts = exports.createPost = exports.postById = void 0;
const typeorm_1 = require("typeorm");
const coin_entity_1 = require("../entities/coin.entity");
const post_entity_1 = require("../entities/post.entity");
const user_entity_1 = require("../entities/user.entity");
const post_schema_1 = require("../schemas/post.schema");
const postById = async (req, res, next, id) => {
    try {
        const post = await (0, typeorm_1.getRepository)(post_entity_1.Post).findOne(id);
        if (!post) {
            return res.status(404).json({
                code: 404,
                error: "post not found.",
            });
        }
        req.post = post;
        next();
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            error: "post's id don't match.",
        });
    }
};
exports.postById = postById;
const createPost = async (req, res) => {
    try {
        const value = await post_schema_1.postSchema.validateAsync(req.body);
        const { title, content, rise, fall } = value;
        const postRepository = (0, typeorm_1.getRepository)(post_entity_1.Post);
        const userRepository = (0, typeorm_1.getRepository)(user_entity_1.User);
        const coinRepository = (0, typeorm_1.getRepository)(coin_entity_1.Coin);
        const post = new post_entity_1.Post();
        post.title = title;
        post.content = content;
        post.rise = rise;
        post.fall = fall;
        await postRepository.insert(post);
        const user = await userRepository.findOne(req.user.id, {
            relations: ["posts"],
        });
        if (!user) {
            return res.status(404).json({
                code: 404,
                error: "user not found",
            });
        }
        const coin = await coinRepository.findOne(req.coin.id, {
            relations: ["posts"],
        });
        if (!coin) {
            return res.status(404).json({
                code: 404,
                error: "coin not found",
            });
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
        res.status(400).json({
            code: 400,
            error: error.message,
        });
    }
};
exports.createPost = createPost;
const getPosts = async (req, res) => {
    try {
        const postRepository = (0, typeorm_1.getRepository)(post_entity_1.Post);
        const posts = [];
        for (const post of req.coin.posts) {
            const matchedPost = await postRepository.findOne(post.id, {
                relations: ["user", "coin"],
            });
            if (!matchedPost) {
                return res.status(404).json({
                    code: 404,
                    error: "post not found.",
                });
            }
            matchedPost.user.password = "";
            matchedPost.user.salt = "";
            posts.push(matchedPost);
        }
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            error: "could not get posts.",
        });
    }
};
exports.getPosts = getPosts;
const getPost = async (req, res) => {
    try {
        const matchedPost = req.coin.posts.find((post) => post.id === req.post.id);
        if (!matchedPost) {
            return res.status(404).json({
                code: 404,
                error: "post not found.",
            });
        }
        const post = await (0, typeorm_1.getRepository)(post_entity_1.Post).findOne(matchedPost.id, {
            relations: ["user", "coin"],
        });
        if (!post) {
            return res.status(404).json({
                code: 404,
                error: "post not found.",
            });
        }
        post.user.password = "";
        post.user.salt = "";
        res.status(200).json(post);
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            error: "could not get post.",
        });
    }
};
exports.getPost = getPost;
const updatePost = async (req, res) => {
    try {
        const value = await post_schema_1.postSchema.validateAsync(req.body);
        const { title, content, rise, fall } = value;
        const postRepository = (0, typeorm_1.getRepository)(post_entity_1.Post);
        await postRepository.update(req.post.id, {
            title,
            content,
            rise,
            fall,
        });
        res.status(200).json({
            message: "succeed.",
        });
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            error: error.message,
        });
    }
};
exports.updatePost = updatePost;
const deletePost = async (req, res) => {
    try {
        await (0, typeorm_1.getRepository)(post_entity_1.Post).delete(req.post.id);
        res.status(200).json({
            message: "succeed.",
        });
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            error: "could not delete post.",
        });
    }
};
exports.deletePost = deletePost;
