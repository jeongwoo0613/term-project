import { NextFunction, Request, Response } from "express";
import { getRepository, Not } from "typeorm";
import { User } from "../entities/user.entity";
import { deleteUserImage } from "../utils/s3.util";

interface IUser {
  password: string;
  salt: string;
}

const userByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
): Promise<any> => {
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
      return res.status(404).json({
        code: 404,
        error: "user not found.",
      });
    }

    req.userByUserId = user;
    next();
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: "user's id don't match.",
    });
  }
};

const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await getRepository(User).find({
      userId: Not("admin"),
    });

    if (!users) {
      return res.status(404).json({
        code: 404,
        error: "users not found.",
      });
    }

    users.forEach((user) => {
      user.password = "";
      user.salt = "";
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: "could not load users.",
    });
  }
};

const getUserByUserId = (req: Request, res: Response): void => {
  req.userByUserId.password = "";
  req.userByUserId.salt = "";

  if (req.userByUserId.followers.length > 0) {
    req.userByUserId.followers.forEach((user: IUser) => {
      user.password = "";
      user.salt = "";
    });
  }

  if (req.userByUserId.following.length > 0) {
    req.userByUserId.following.forEach((user: IUser) => {
      user.password = "";
      user.salt = "";
    });
  }

  res.status(200).json(req.userByUserId);
};

const getUser = (req: Request, res: Response): void => {
  req.user.password = "";
  req.user.salt = "";

  if (req.user.followers.length > 0) {
    req.user.followers.forEach((user: IUser) => {
      user.password = "";
      user.salt = "";
    });
  }

  if (req.user.following.length > 0) {
    req.user.following.forEach((user: IUser) => {
      user.password = "";
      user.salt = "";
    });
  }

  res.status(200).json(req.user);
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.user;

    await getRepository(User).update(id, {
      ...req.body,
    });

    res.status(200).json({
      message: "succeed.",
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: "could not update user.",
    });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageKey } = req.user;

    if (imageKey !== "userdefault.png") {
      await deleteUserImage(imageKey);
    }

    await getRepository(User).delete(req.user.id);

    res.status(200).json({
      message: "succeed.",
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: "could not delete user.",
    });
  }
};

const updateUserImage = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        error: "could not upload file.",
      });
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
    res.status(400).json({
      code: 400,
      error: "could not upload image.",
    });
  }
};

const addFollow = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.user;
    const { followingId } = req.body;
    const userRepository = getRepository(User);

    const currentUser = await userRepository.findOne(id, {
      relations: ["following"],
    });

    if (!currentUser) {
      return res.status(404).json({
        code: 404,
        error: "current user not found.",
      });
    }

    const followingUser = await userRepository.findOne(followingId, {
      relations: ["followers"],
    });

    if (!followingUser) {
      return res.status(404).json({
        code: 404,
        error: "following user not found.",
      });
    }

    if (
      !currentUser.following.some((user) => user.id === followingId) &&
      !followingUser.followers.some((user) => user.id === id)
    ) {
      currentUser.following.push(followingUser);
      await userRepository.save(currentUser);

      followingUser.followers.push(currentUser);
      await userRepository.save(followingUser);
    }

    res.status(200).json({
      message: "succeed.",
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: "could not follow user.",
    });
  }
};

const deleteFollow = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.user;
    const { followingId } = req.body;
    const userRepository = getRepository(User);

    const currentUser = await userRepository.findOne(id, {
      relations: ["following"],
    });

    if (!currentUser) {
      return res.status(404).json({
        code: 404,
        error: "current user not found.",
      });
    }

    const followingUser = await userRepository.findOne(followingId, {
      relations: ["followers"],
    });

    if (!followingUser) {
      return res.status(404).json({
        code: 404,
        error: "following user not found.",
      });
    }

    if (
      currentUser.following.some((user) => user.id === followingId) &&
      followingUser.followers.some((user) => user.id === id)
    ) {
      currentUser.following.splice(
        currentUser.following.findIndex((user) => user.id === followingId),
        1
      );
      await userRepository.save(currentUser);

      followingUser.followers.splice(
        followingUser.followers.findIndex((user) => user.id === id),
        1
      );
      await userRepository.save(followingUser);
    }

    res.status(200).json({
      message: "succeed.",
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: "could not unfollow user.",
    });
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
