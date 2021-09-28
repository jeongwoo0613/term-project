"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.createComment = exports.commentById = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const typeorm_1 = require("typeorm");
const entities_1 = require("../entities");
const commentById = async (req, res, next, id) => {
    try {
        const comment = await (0, typeorm_1.getRepository)(entities_1.Comment).findOne(id);
        if (!comment) {
            return next((0, http_errors_1.default)(404, "comment not found."));
        }
        req.comment = comment;
        next();
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "comment's id don't match."));
    }
};
exports.commentById = commentById;
const createComment = async (req, res, next) => {
    try {
        const { content } = req.body;
        const commentRepository = (0, typeorm_1.getRepository)(entities_1.Comment);
        const postRepository = (0, typeorm_1.getRepository)(entities_1.Post);
        const userRepository = (0, typeorm_1.getRepository)(entities_1.User);
        const comment = new entities_1.Comment();
        comment.content = content;
        await commentRepository.insert(comment);
        const user = await userRepository.findOne(req.user.id, {
            relations: ["comments"],
        });
        if (!user) {
            return next((0, http_errors_1.default)(404, "user not found."));
        }
        const post = await postRepository.findOne(req.post.id, {
            relations: ["comments"],
        });
        if (!post) {
            return next((0, http_errors_1.default)(404, "post not found."));
        }
        user.comments.push(comment);
        await userRepository.save(user);
        post.comments.push(comment);
        await postRepository.save(post);
        res.status(201).json({
            message: "succeed.",
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not create comment."));
    }
};
exports.createComment = createComment;
const updateComment = async (req, res, next) => {
    try {
        const { id } = req.comment;
        await (0, typeorm_1.getRepository)(entities_1.Comment).update(id, {
            ...req.body,
        });
        res.status(200).json({
            message: "succeed.",
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not update comment."));
    }
};
exports.updateComment = updateComment;
const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.comment;
        await (0, typeorm_1.getRepository)(entities_1.Comment).delete(id);
        res.status(200).json({
            message: "succeed.",
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not delete comment."));
    }
};
exports.deleteComment = deleteComment;
