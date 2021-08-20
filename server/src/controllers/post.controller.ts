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

    await postRepository.insert(post);

    const user = await userRepository.findOne(req.user.id, {
      relations: ["posts", "rise", "fall"],
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        error: "user not found",
      });
    }

    const coin = await coinRepository.findOne(req.coin.id, {
      relations: ["posts", "rise", "fall"],
    });

    if (!coin) {
      return res.status(404).json({
        code: 404,
        error: "coin not found",
      });
    }

    if (
      rise &&
      !user.rise.find((coin) => coin.id === req.coin.id) &&
      !coin.rise.find((user) => user.id === req.user.id) &&
      !user.fall.find((coin) => coin.id === req.coin.id) &&
      !coin.fall.find((user) => user.id === req.user.id)
    ) {
      user.rise.push(req.coin);
      coin.rise.push(req.user);
    } else if (
      fall &&
      !user.fall.find((coin) => coin.id === req.coin.id) &&
      !coin.fall.find((user) => user.id === req.user.id) &&
      !user.rise.find((coin) => coin.id === req.coin.id) &&
      !coin.rise.find((user) => user.id === req.user.id)
    ) {
      user.fall.push(req.coin);
      coin.fall.push(req.user);
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
    const posts = await getRepository(Post).find();

    if (!posts) {
      return res.status(404).json({
        code: 404,
        error: "posts not found.",
      });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: "could not load posts",
    });
  }
};

const getPost = (req: Request, res: Response): void => {
  res.status(200).json(req.post);
};

const updatePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const value = await postSchema.validateAsync(req.body);
    const { title, content, rise, fall } = value;
    const postRepository = getRepository(Post);
    const userRepository = getRepository(User);
    const coinRepository = getRepository(Coin);

    await postRepository.update(req.post.id, {
      title,
      content,
    });

    const user = await userRepository.findOne(req.user.id, {
      relations: ["posts", "rise", "fall"],
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        error: "user not found",
      });
    }

    const coin = await coinRepository.findOne(req.coin.id, {
      relations: ["posts", "rise", "fall"],
    });

    if (!coin) {
      return res.status(404).json({
        code: 404,
        error: "coin not found",
      });
    }

    if (
      rise &&
      user.fall.find((coin) => coin.id === req.coin.id) &&
      coin.fall.find((user) => user.id === req.user.id)
    ) {
      user.fall.splice(
        user.fall.findIndex((coin) => coin.id === req.coin.id),
        1
      );
      coin.fall.splice(
        coin.fall.findIndex((user) => user.id === req.user.id),
        1
      );

      user.rise.push(req.coin);
      coin.rise.push(req.user);
    } else if (
      fall &&
      user.rise.find((coin) => coin.id === req.coin.id) &&
      coin.rise.find((user) => user.id === req.user.id)
    ) {
      user.rise.splice(
        user.rise.findIndex((coin) => coin.id === req.coin.id),
        1
      );
      coin.rise.splice(
        coin.rise.findIndex((user) => user.id === req.user.id),
        1
      );

      user.fall.push(req.coin);
      coin.fall.push(req.user);
    }

    await userRepository.save(user);

    await coinRepository.save(coin);

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
