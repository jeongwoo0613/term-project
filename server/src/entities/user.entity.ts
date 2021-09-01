import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Coin } from "./coin.entity";
import { Comment } from "./comment.entity";
import { Post } from "./post.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  userId!: string;

  @Column()
  password!: string;

  @Column()
  salt!: string;

  @Column()
  nickname!: string;

  @Column()
  googleId!: string;

  @Column()
  facebookId!: string;

  @Column()
  email!: string;

  @Column()
  image!: string;

  @Column()
  imageKey!: string;

  @ManyToMany((type) => User, (user) => user.followers)
  @JoinTable()
  following!: User[];

  @ManyToMany((type) => User, (user) => user.following)
  followers!: User[];

  @OneToMany((type) => Post, (post) => post.user)
  posts!: Post[];

  @OneToMany((type) => Comment, (comment) => comment.user)
  comments!: Comment[];

  @OneToMany((type) => Coin, (coin) => coin.user)
  interests!: Coin[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
