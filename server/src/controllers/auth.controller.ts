import passport from "passport";
import createHttpError from "http-errors";
import { getRepository } from "typeorm";
import { User } from "../entities/user.entity";
import { NextFunction, Request, Response } from "express";
import { randomBytes, pbkdf2 } from "crypto";
import { sign } from "jsonwebtoken";
import { promisify } from "util";

const makeSalt = async (): Promise<string> => {
  const randomBytesPromise = promisify(randomBytes);
  const buf = await randomBytesPromise(64);

  return buf.toString("hex");
};

const hashPassword = async (
  password: string,
  salt: string
): Promise<string> => {
  const pbkdf2Promise = promisify(pbkdf2);
  const hash = await pbkdf2Promise(password, salt, 100000, 64, "sha512");

  return hash.toString("hex");
};

const verifyPassword = async (
  password: string,
  hashedPassword: string,
  salt: string
): Promise<boolean> => {
  return (await hashPassword(password, salt)) === hashedPassword;
};

const verifyToken = passport.authenticate("jwt", { session: false });

const verifyGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

const authGoogle = passport.authenticate("google", {
  session: false,
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

  res.redirect(`http://localhost:3000/login?token=${token}&user=${user}`);
};

const verifyAdminAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const authorized = req.user && req.user.userId === "admin";

  if (!authorized) {
    return next(createHttpError(401, "admin is not authorized."));
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
    const salt = await makeSalt();
    const hashedPassword = await hashPassword(password, salt);
    newUser.userId = userId;
    newUser.password = hashedPassword;
    newUser.nickname = nickname;
    newUser.salt = salt;
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

    const match = await verifyPassword(password, user.password, user.salt);

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
    user.salt = "";

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
