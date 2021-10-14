declare namespace Express {
  export interface Request {
    file: {
      location: string;
      key: string;
    };
    user: import("../../src/entities").User;
    userByUserId: import("../../src/entities").User;
    post: import("../../src/entities").Post;
    coin: import("../../src/entities").Coin;
    comment: import("../../src/entities").Comment;
  }
}
