import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import passport from "passport";
import auth from "./routes/auth.route";
import user from "./routes/user.route";
import coin from "./routes/coin.route";
import post from "./routes/post.route";
import admin from "./routes/admin.route";
import { googleStrategy, jwtStrategy } from "./configs/passport.config";

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(helmet());
  app.use(compression());
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(passport.initialize());

passport.use(jwtStrategy);
passport.use(googleStrategy);

app.use("/api", auth);
app.use("/api", user);
app.use("/api", coin);
app.use("/api", post);
app.use("/api", admin);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({
    code: 400,
    error: err.message,
  });
});

export default app;
