import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Coin } from "../entities/coin.entity";
import { Post } from "../entities/post.entity";
import { User } from "../entities/user.entity";

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

const createPost = async (req: Request, res: Response): Promise<void> => {
  const { title, content, rise, fall } = req.body;
  const postRepository = getRepository(Post);

  try {
    const post = new Post();
    post.title = title;
    post.content = content;

    await postRepository.insert(post);

    const user = await getRepository(User).findOne(req.user.id, {
      relations: ["posts", "rise", "fall"],
    });

    const coin = await getRepository(Coin).findOne(req.coin.id, {
      relations: ["posts", "rise", "fall"],
    });

    if (
      rise === "true" &&
      !user?.rise.find((coin) => coin.id === req.coin.id) &&
      !coin?.rise.find((user) => user.id === req.user.id) &&
      !user?.fall.find((coin) => coin.id === req.coin.id) &&
      !coin?.fall.find((user) => user.id === req.user.id)
    ) {
      user?.rise.push(req.coin);
      coin?.rise.push(req.user);
    } else if (
      fall === "true" &&
      !user?.fall.find((coin) => coin.id === req.coin.id) &&
      !coin?.fall.find((user) => user.id === req.user.id) &&
      !user?.rise.find((coin) => coin.id === req.coin.id) &&
      !coin?.rise.find((user) => user.id === req.user.id)
    ) {
      user?.fall.push(req.coin);
      coin?.fall.push(req.user);
    }

    user?.posts.push(post);

    if (user) {
      await getRepository(User).save(user);
    }

    coin?.posts.push(post);

    if (coin) {
      await getRepository(Coin).save(coin);
    }

    res.status(201).json({
      message: "succeed.",
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: "could not post",
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

export { postById, createPost, getPosts, getPost };
