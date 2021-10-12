import passport from "passport";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { User } from "../entities";
import { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";

const verifyToken = passport.authenticate("jwt", { session: false });

const verifyGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

const authGoogle = passport.authenticate("google", {
  session: false,
  // TODO: seperate production and development environment
  failureRedirect: "http://localhost:3000/login",
});

const succeedAuthGoogle = (req: Request, res: Response): void => {
  const user = JSON.stringify(req.user);
  const token = sign(
    {
      id: req.user.id,
    },
    process.env.JWT_SECRET as string,
    {
      algorithm: "HS256",
      expiresIn: "30d",
    }
  );
  // TODO: seperate production and development environment
  res.redirect(`http://localhost:3000/login?token=${token}&user=${user}`);
};

const verifyAdminAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authorized = req.user.userId === "admin";

  if (!authorized) {
    return next(createHttpError(401, "not authorized."));
  }

  next();
};

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, password, nickname } = req.body;

    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ userId });

    if (user) {
      return next(createHttpError(400, "user already exist."));
    }

    const newUser = new User();
    const saltRounds = 10;
    newUser.userId = userId;
    newUser.password = await bcrypt.hash(password, saltRounds);
    newUser.nickname = nickname;
    newUser.image =
      "https://term-project-default.s3.ap-northeast-2.amazonaws.com/userdefault.png";
    newUser.imageKey = "userdefault.png";

    await userRepository.insert(newUser);

    res.status(201).json({
      message: "succeed.",
    });
  } catch (error) {
    next(createHttpError(400, "could not signup."));
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, password } = req.body;

    const user = await getRepository(User).findOne({ userId });

    if (!user) {
      return next(createHttpError(404, "user not found."));
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return next(createHttpError(400, "password don't match."));
    }

    const token = sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET as string,
      {
        algorithm: "HS256",
        expiresIn: "30d",
      }
    );

    user.password = "";

    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    next(createHttpError(400, "could not login."));
  }
};

export {
  signup,
  login,
  verifyToken,
  verifyGoogle,
  authGoogle,
  succeedAuthGoogle,
  verifyAdminAuthorization,
};
