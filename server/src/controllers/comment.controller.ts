import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Post } from "../entities/post.entity";
import { User } from "../entities/user.entity";
import { Comment } from "../entities/comment.entity";

const commentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
  id: number
): Promise<void> => {
  try {
    const comment = await getRepository(Comment).findOne(id);

    if (!comment) {
      return next(createHttpError(404, "comment not found."));
    }

    req.comment = comment;
    next();
  } catch (error) {
    next(createHttpError(400, "comment's id don't match."));
  }
};

const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { content } = req.body;
    const commentRepository = getRepository(Comment);
    const postRepository = getRepository(Post);
    const userRepository = getRepository(User);

    const comment = new Comment();
    comment.content = content;

    await commentRepository.insert(comment);

    const user = await userRepository.findOne(req.user.id, {
      relations: ["comments"],
    });

    if (!user) {
      return next(createHttpError(404, "user not found."));
    }

    const post = await postRepository.findOne(req.post.id, {
      relations: ["comments"],
    });

    if (!post) {
      return next(createHttpError(404, "post not found."));
    }

    user.comments.push(comment);
    await userRepository.save(user);

    post.comments.push(comment);
    await postRepository.save(post);

    res.status(201).json({
      message: "succeed.",
    });
  } catch (error) {
    next(createHttpError(400, "could not create comment."));
  }
};

const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { content } = req.body;

    await getRepository(Comment).update(req.comment.id, {
      content,
    });

    res.status(200).json({
      message: "succeed.",
    });
  } catch (error) {
    next(createHttpError(400, "could not update comment."));
  }
};

const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await getRepository(Comment).delete(req.comment.id);

    res.status(200).json({
      message: "succeed.",
    });
  } catch (error) {
    next(createHttpError(400, "could not delete comment."));
  }
};

export { commentById, createComment, updateComment, deleteComment };
