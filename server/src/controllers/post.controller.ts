import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Coin } from "../entities/coin.entity";
import { Post } from "../entities/post.entity";
import { User } from "../entities/user.entity";
import { postSchema } from "../schemas/post.schema";

const postById = async (
  req: Request,
  res: Response,
  next: NextFunction,
  id: number
): Promise<any> => {
  try {
    const post = await getRepository(Post).findOne(id);

    if (!post) {
      return res.status(404).json({
        code: 404,
        error: "post not found.",
      });
    }

    req.post = post;
    next();
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: "post's id don't match.",
    });
  }
};

const createPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const value = await postSchema.validateAsync(req.body);
    const { title, content, rise, fall } = value;
    const postRepository = getRepository(Post);
    const userRepository = getRepository(User);
    const coinRepository = getRepository(Coin);

    const post = new Post();
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
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: error.message,
    });
  }
};

const getPosts = async (req: Request, res: Response): Promise<any> => {
  try {
    const postRepository = getRepository(Post);
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
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: "could not get posts.",
    });
  }
};

const getPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const matchedPost = req.coin.posts.find((post) => post.id === req.post.id);

    if (!matchedPost) {
      return res.status(404).json({
        code: 404,
        error: "post not found.",
      });
    }

    const post = await getRepository(Post).findOne(matchedPost.id, {
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
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: "could not get post.",
    });
  }
};

const updatePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const value = await postSchema.validateAsync(req.body);
    const { title, content, rise, fall } = value;
    const postRepository = getRepository(Post);

    await postRepository.update(req.post.id, {
      title,
      content,
      rise,
      fall,
    });

    res.status(200).json({
      message: "succeed.",
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: error.message,
    });
  }
};

const deletePost = async (req: Request, res: Response): Promise<any> => {
  try {
    await getRepository(Post).delete(req.post.id);

    res.status(200).json({
      message: "succeed.",
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: "could not delete post.",
    });
  }
};

export { postById, createPost, getPosts, getPost, updatePost, deletePost };
