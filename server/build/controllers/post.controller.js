"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPost = exports.getPosts = exports.createPost = exports.postById = void 0;
const typeorm_1 = require("typeorm");
const coin_entity_1 = require("../entities/coin.entity");
const post_entity_1 = require("../entities/post.entity");
const user_entity_1 = require("../entities/user.entity");
const postById = async (req, res, next, id) => {
    try {
        const post = await typeorm_1.getRepository(post_entity_1.Post).findOne(id);
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
    const { title, content, rise, fall } = req.body;
    const postRepository = typeorm_1.getRepository(post_entity_1.Post);
    try {
        const post = new post_entity_1.Post();
        post.title = title;
        post.content = content;
        await postRepository.insert(post);
        const user = await typeorm_1.getRepository(user_entity_1.User).findOne(req.user.id, {
            relations: ["posts", "rise", "fall"],
        });
        const coin = await typeorm_1.getRepository(coin_entity_1.Coin).findOne(req.coin.id, {
            relations: ["posts", "rise", "fall"],
        });
        if (rise === "true" &&
            !user?.rise.find((coin) => coin.id === req.coin.id) &&
            !coin?.rise.find((user) => user.id === req.user.id) &&
            !user?.fall.find((coin) => coin.id === req.coin.id) &&
            !coin?.fall.find((user) => user.id === req.user.id)) {
            user?.rise.push(req.coin);
            coin?.rise.push(req.user);
        }
        else if (fall === "true" &&
            !user?.fall.find((coin) => coin.id === req.coin.id) &&
            !coin?.fall.find((user) => user.id === req.user.id) &&
            !user?.rise.find((coin) => coin.id === req.coin.id) &&
            !coin?.rise.find((user) => user.id === req.user.id)) {
            user?.fall.push(req.coin);
            coin?.fall.push(req.user);
        }
        user?.posts.push(post);
        if (user) {
            await typeorm_1.getRepository(user_entity_1.User).save(user);
        }
        coin?.posts.push(post);
        if (coin) {
            await typeorm_1.getRepository(coin_entity_1.Coin).save(coin);
        }
        res.status(201).json({
            message: "succeed.",
        });
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            error: "could not post",
        });
    }
};
exports.createPost = createPost;
const getPosts = async (req, res) => {
    try {
        const posts = await typeorm_1.getRepository(post_entity_1.Post).find();
        if (!posts) {
            return res.status(404).json({
                code: 404,
                error: "posts not found.",
            });
        }
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            error: "could not load posts",
        });
    }
};
exports.getPosts = getPosts;
const getPost = (req, res) => {
    res.status(200).json(req.post);
};
exports.getPost = getPost;
