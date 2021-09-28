import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User, Coin, Comment } from ".";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column("text")
  content!: string;

  @Column()
  rise!: boolean;

  @Column()
  fall!: boolean;

  @ManyToOne((type) => Coin, (coin) => coin.posts)
  coin!: Coin;

  @ManyToOne((type) => User, (user) => user.posts)
  user!: User;

  @OneToMany((type) => Comment, (comment) => comment.post)
  comments!: Comment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
