import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
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

  @Column("double")
  openingPrice!: number;

  @Column("double")
  highPrice!: number;

  @Column("double")
  lowPrice!: number;

  @Column("double")
  tradePrice!: number;

  @Column("double")
  prevClosingPrice!: number;

  @Column()
  change!: string;

  @Column("double")
  accTradePrice!: number;

  @Column("double")
  accTradePrice24h!: number;

  @Column("double")
  accTradeVolume!: number;

  @Column("double")
  accTradeVolume24h!: number;

  @Column("double")
  highest52WeekPrice!: number;

  @Column()
  highest52WeekDate!: string;

  @Column("double")
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

  @ManyToMany((type) => User, (user) => user.interests)
  users!: User[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
