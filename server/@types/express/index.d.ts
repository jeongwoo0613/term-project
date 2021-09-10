declare namespace Express {
  export interface Request {
    file: {
      location: string;
      key: string;
    };
    user: import("../../src/entities/user.entity").User;
    userByUserId: import("../../src/entities/user.entity").User;
    post: import("../../src/entities/post.entity").Post;
    coin: import("../../src/entities/coin.entity").Coin;
    comment: import("../../src/entities/comment.entity").Comment;
  }
}
