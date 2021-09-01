"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coin = void 0;
const typeorm_1 = require("typeorm");
const post_entity_1 = require("./post.entity");
const user_entity_1 = require("./user.entity");
let Coin = class Coin {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Coin.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Coin.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Coin.prototype, "symbol", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Coin.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Coin.prototype, "market", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double" }),
    __metadata("design:type", Number)
], Coin.prototype, "openingPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double" }),
    __metadata("design:type", Number)
], Coin.prototype, "highPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double" }),
    __metadata("design:type", Number)
], Coin.prototype, "lowPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double" }),
    __metadata("design:type", Number)
], Coin.prototype, "tradePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double" }),
    __metadata("design:type", Number)
], Coin.prototype, "prevClosingPrice", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Coin.prototype, "change", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double" }),
    __metadata("design:type", Number)
], Coin.prototype, "accTradePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double" }),
    __metadata("design:type", Number)
], Coin.prototype, "accTradePrice24h", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double" }),
    __metadata("design:type", Number)
], Coin.prototype, "accTradeVolume", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double" }),
    __metadata("design:type", Number)
], Coin.prototype, "accTradeVolume24h", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double" }),
    __metadata("design:type", Number)
], Coin.prototype, "highest52WeekPrice", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Coin.prototype, "highest52WeekDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double" }),
    __metadata("design:type", Number)
], Coin.prototype, "lowest52WeekPrice", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Coin.prototype, "lowest52WeekDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Coin.prototype, "supplyLimit", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Coin.prototype, "homepage", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Coin.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Coin.prototype, "github", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Coin.prototype, "whitepaper", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Coin.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Coin.prototype, "imageKey", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Coin.prototype, "initialRelease", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => post_entity_1.Post, (post) => post.coin),
    __metadata("design:type", Array)
], Coin.prototype, "posts", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => user_entity_1.User, (user) => user.interests),
    __metadata("design:type", user_entity_1.User)
], Coin.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Coin.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Coin.prototype, "updatedAt", void 0);
Coin = __decorate([
    (0, typeorm_1.Entity)()
], Coin);
exports.Coin = Coin;
