import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { getRepository, Not } from "typeorm";
import { Post, User } from "../entities";
import { deleteUserImage } from "../utils";

const userByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
): Promise<void> => {
  try {
    const user = await getRepository(User).findOne(
      {
        userId: id,
      },
      {
        relations: ["following", "followers", "posts", "interests"],
      }
    );

    if (!user) {
      return next(createHttpError(404, "user not found."));
    }

    req.userByUserId = user;
    next();
  } catch (error) {
    next(createHttpError(400, "user's id don't match."));
  }
};

const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await getRepository(User).find({
      userId: Not("admin"),
    });

    if (users.length === 0) {
      return next(createHttpError(404, "users not found."));
    }

    users.forEach((user) => {
      user.password = "";
    });

    res.status(200).json(users);
  } catch (error) {
    next(createHttpError(400, "could not get users."));
  }
};

const getUserByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.userByUserId.posts.length > 0) {
      const posts = [];

      for (const post of req.userByUserId.posts) {
        const matchedPost = await getRepository(Post).findOne(post.id, {
          relations: ["coin"],
        });

        if (!matchedPost) {
          return next(createHttpError(404, "post not found."));
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
      req.userByUserId.interests.sort(
        (a, b) => b.accTradePrice24h - a.accTradePrice24h
      );
    }

    res.status(200).json(req.userByUserId);
  } catch (error) {
    next(createHttpError(400, "could not get user."));
  }
};

const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user.posts.length > 0) {
      const posts = [];

      for (const post of req.user.posts) {
        const matchedPost = await getRepository(Post).findOne(post.id, {
          relations: ["coin"],
        });

        if (!matchedPost) {
          return next(createHttpError(404, "post not found."));
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
      req.user.interests.sort(
        (a, b) => b.accTradePrice24h - a.accTradePrice24h
      );
    }

    res.status(200).json(req.user);
  } catch (error) {
    next(createHttpError(400, "could not get user."));
  }
};

const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.user;

    await getRepository(User).update(id, {
      ...req.body,
    });

    res.status(200).json({
      message: "succeed.",
    });
  } catch (error) {
    next(createHttpError(400, "could not update user."));
  }
};

const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, imageKey } = req.user;

    if (imageKey && imageKey !== "userdefault.png") {
      await deleteUserImage(imageKey);
    }

    await getRepository(User).delete(id);

    res.status(200).json({
      message: "succeed.",
    });
  } catch (error) {
    next(createHttpError(400, "could not delete user."));
  }
};

const updateUserImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      return next(createHttpError(400, "could not upload file."));
    }

    const { location, key } = req.file;
    const { id, imageKey } = req.user;

    if (imageKey !== "userdefault.png") {
      deleteUserImage(imageKey);
    }

    await getRepository(User).update(id, {
      image: location,
      imageKey: key,
    });

    res.status(200).json(location);
  } catch (error) {
    next(createHttpError(400, "could not update image."));
  }
};

const addFollow = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.user;
    const { followingId } = req.body;

    const userRepository = getRepository(User);

    const currentUser = await userRepository.findOne(id, {
      relations: ["following"],
    });

    if (!currentUser) {
      return next(createHttpError(404, "current user not found."));
    }

    const followingUser = await userRepository.findOne(followingId, {
      relations: ["followers"],
    });

    if (!followingUser) {
      return next(createHttpError(404, "following user not found."));
    }

    const checkFollowingAndFollowers =
      currentUser.following.some((user) => user.id === followingId) &&
      followingUser.followers.some((user) => user.id === id);

    if (checkFollowingAndFollowers) {
      next(createHttpError(400, "already following."));
    }

    currentUser.following.push(followingUser);
    await userRepository.save(currentUser);

    followingUser.followers.push(currentUser);
    await userRepository.save(followingUser);

    res.status(200).json({
      message: "succeed.",
    });
  } catch (error) {
    next(createHttpError(400, "could not follow user."));
  }
};

const deleteFollow = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.user;
    const { followingId } = req.body;

    const userRepository = getRepository(User);

    const currentUser = await userRepository.findOne(id, {
      relations: ["following"],
    });

    if (!currentUser) {
      return next(createHttpError(404, "current user not found."));
    }

    const followingUser = await userRepository.findOne(followingId, {
      relations: ["followers"],
    });

    if (!followingUser) {
      return next(createHttpError(404, "following user not found."));
    }

    const checkFollowingAndFollowers =
      currentUser.following.some((user) => user.id === followingId) &&
      followingUser.followers.some((user) => user.id === id);

    if (!checkFollowingAndFollowers) {
      next(createHttpError(400, "not following."));
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
  } catch (error) {
    next(createHttpError(400, "could not unfollow user."));
  }
};

export {
  userByUserId,
  getUsers,
  getUserByUserId,
  getUser,
  updateUser,
  deleteUser,
  updateUserImage,
  addFollow,
  deleteFollow,
};
