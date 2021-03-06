import passportJwtStrategy from "passport-jwt";
import passportGoogleStrategy from "passport-google-oauth20";
import { getRepository } from "typeorm";
import { User } from "../entities";
import { v4 as uuidv4 } from "uuid";

const opts = {
  jwtFromRequest: passportJwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
  algorithms: ["HS256"],
};

const jwtStrategy = new passportJwtStrategy.Strategy(
  opts,
  async (jwt_payload, done) => {
    try {
      const user = await getRepository(User).findOne(
        { id: jwt_payload.id },
        {
          relations: ["following", "followers", "posts", "interests"],
        }
      );

      if (user) {
        return done(null, user);
      }

      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }
);

const googleStrategy = new passportGoogleStrategy.Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne(
        { googleId: profile.id },
        {
          relations: ["following", "followers", "posts", "interests"],
        }
      );

      if (user) {
        return done(null, user);
      }

      const { id, displayName, emails, photos } = profile;
      const email = emails ?? [{ value: "" }];
      const image = photos ?? [
        {
          value:
            "https://term-project-default.s3.ap-northeast-2.amazonaws.com/userdefault.png",
        },
      ];

      const newUser = new User();
      const checkUserDefaultImage =
        image[0].value ===
        "https://term-project-default.s3.ap-northeast-2.amazonaws.com/userdefault.png";

      newUser.googleId = id;
      newUser.nickname = displayName;
      newUser.email = email[0].value;
      newUser.image = image[0].value;

      if (checkUserDefaultImage) {
        newUser.imageKey = "userdefault.png";
      }

      newUser.userId = uuidv4()
        .replace(/[^0-9a-z]/g, "")
        .slice(0, 16);

      await userRepository.insert(newUser);

      return done(null, newUser);
    } catch (error: any) {
      return done(error, false);
    }
  }
);

export { jwtStrategy, googleStrategy };
