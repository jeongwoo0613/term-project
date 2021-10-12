"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMigration1634036219341 = void 0;
class UserMigration1634036219341 {
    async up(queryRunner) {
        queryRunner.dropColumn("user", "salt");
    }
    async down(queryRunner) { }
}
exports.UserMigration1634036219341 = UserMigration1634036219341;
