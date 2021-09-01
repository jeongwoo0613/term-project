import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Post } from "./post.entity";
import { User } from "./user.entity";

@Entity()
export class Coin {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  symbol!: string;

  @Column("text")
  description!: string;

  @Column()
  market!: string;

  @Column({ type: "double" })
  openingPrice!: number;

  @Column({ type: "double" })
  highPrice!: number;

  @Column({ type: "double" })
  lowPrice!: number;

  @Column({ type: "double" })
  tradePrice!: number;

  @Column({ type: "double" })
  prevClosingPrice!: number;

  @Column()
  change!: string;

  @Column({ type: "double" })
  accTradePrice!: number;

  @Column({ type: "double" })
  accTradePrice24h!: number;

  @Column({ type: "double" })
  accTradeVolume!: number;

  @Column({ type: "double" })
  accTradeVolume24h!: number;

  @Column({ type: "double" })
  highest52WeekPrice!: number;

  @Column()
  highest52WeekDate!: string;

  @Column({ type: "double" })
  lowest52WeekPrice!: number;

  @Column()
  lowest52WeekDate!: string;

  @Column()
  supplyLimit!: string;

  @Column()
  homepage!: string;

  @Column()
  author!: string;

  @Column()
  github!: string;

  @Column()
  whitepaper!: string;

  @Column()
  image!: string;

  @Column()
  imageKey!: string;

  @Column()
  initialRelease!: string;

  @OneToMany((type) => Post, (post) => post.coin)
  posts!: Post[];

  @ManyToOne((type) => User, (user) => user.interests)
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
