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
import { Coin, Comment, Post } from ".";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  userId!: string;

  @Column({ nullable: true })
  password!: string;

  @Column()
  nickname!: string;

  @Column({ nullable: true })
  googleId!: string;

  @Column({ nullable: true })
  facebookId!: string;

  @Column({ nullable: true })
  email!: string;

  @Column()
  image!: string;

  @Column({ nullable: true })
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

  @ManyToMany((type) => Coin, (coin) => coin.users)
  @JoinTable()
  interests!: Coin[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
