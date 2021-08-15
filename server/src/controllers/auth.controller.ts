import passport from "passport";
import { getRepository } from "typeorm";
import { User } from "../entities/user.entity";
import { NextFunction, Request, Response } from "express";
import { randomBytes, pbkdf2 } from "crypto";
import { sign } from "jsonwebtoken";
import { promisify } from "util";
import { signupSchema } from "../schemas/auth.schema";

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
    return res.status(401).json({
      code: 401,
      error: "admin is not authorized.",
    });
  }
  next();
};

const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const value = await signupSchema.validateAsync(req.body);
    const { userId, password, nickname } = value;
    const userRepository = getRepository(User);

    const result = await userRepository.findOne({ userId });

    if (result) {
      return res.status(400).json({
        code: 400,
        error: "user already exists.",
      });
    }

    const user = new User();
    const salt = await makeSalt();
    const hashedPassword = await hashPassword(password, salt);
    user.userId = userId;
    user.password = hashedPassword;
    user.googleId = "";
    user.facebookId = "";
    user.email = "";
    user.nickname = nickname;
    user.salt = salt;
    user.image =
      "https://term-project-default.s3.ap-northeast-2.amazonaws.com/userdefault.png";
    user.imageKey = "userdefault.png";

    await userRepository.insert(user);
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

const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, password } = req.body;

    const user = await getRepository(User).findOne({ userId });

    if (!user) {
      return res.status(404).json({
        code: 404,
        error: "user not found.",
      });
    }

    const check = await verifyPassword(password, user.password, user.salt);

    if (!check) {
      return res.status(400).json({
        code: 400,
        error: "password don't match.",
      });
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
    res.status(400).json({
      code: 400,
      error: error.message,
    });
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
