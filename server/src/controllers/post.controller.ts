import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Coin, Post, User, Comment } from "../entities";

const postById = async (
  req: Request,
  res: Response,
  next: NextFunction,
  id: number
): Promise<void> => {
  try {
    const post = await getRepository(Post).findOne(id);

    if (!post) {
      return next(createHttpError(404, "post not found."));
    }

    req.post = post;
    next();
  } catch (error) {
    next(createHttpError(400, "post's id don't match."));
  }
};

const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, content, rise, fall } = req.body;

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
      return next(createHttpError(404, "user not found."));
    }

    const coin = await coinRepository.findOne(req.coin.id, {
      relations: ["posts"],
    });

    if (!coin) {
      return next(createHttpError(404, "coin not found."));
    }

    user.posts.push(post);
    await userRepository.save(user);

    coin.posts.push(post);
    await coinRepository.save(coin);

    res.status(201).json({
      message: "succeed.",
    });
  } catch (error) {
    next(createHttpError(400, "could not create post."));
  }
};

const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const posts = [];

    if (req.coin.posts.length > 0) {
      for (const post of req.coin.posts) {
        const matchedPost = await getRepository(Post).findOne(post.id, {
          relations: ["user", "coin"],
        });

        if (!matchedPost) {
          return next(createHttpError(404, "post not found."));
        }

        matchedPost.user.password = "";
        posts.push(matchedPost);
      }
      posts.sort((a, b) => b.id - a.id);
    }

    res.status(200).json(posts);
  } catch (error) {
    next(createHttpError(400, "could not get posts."));
  }
};

const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const matchedPost = req.coin.posts.find((post) => post.id === req.post.id);

    if (!matchedPost) {
      return next(createHttpError(404, "post not found."));
    }

    const post = await getRepository(Post).findOne(matchedPost.id, {
      relations: ["user", "coin", "comments"],
    });

    if (!post) {
      return next(createHttpError(404, "post not found."));
    }

    post.user.password = "";

    const comments = [];

    for (const comment of post.comments) {
      const matchedComment = await getRepository(Comment).findOne(comment.id, {
        relations: ["user"],
      });

      if (!matchedComment) {
        return next(createHttpError(404, "comment not found."));
      }

      matchedComment.user.password = "";
      comments.push(matchedComment);
    }

    post.comments = comments;
    res.status(200).json(post);
  } catch (error) {
    next(createHttpError(400, "could not get post."));
  }
};

const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.post;

    await getRepository(Post).update(id, {
      ...req.body,
    });

    res.status(200).json({
      message: "succeed.",
    });
  } catch (error) {
    next(createHttpError(400, "could not update post."));
  }
};

const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.post;

    if (req.post.user.id !== req.user.id) {
      return next(
        createHttpError(400, "post's user id and request user id don't match.")
      );
    }

    await getRepository(Post).delete(id);

    res.status(200).json({
      message: "succeed.",
    });
  } catch (error) {
    next(createHttpError(400, "could not delete post."));
  }
};

export { postById, createPost, getPosts, getPost, updatePost, deletePost };
