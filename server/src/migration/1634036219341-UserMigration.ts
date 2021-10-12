import { MigrationInterface, QueryRunner } from "typeorm";

export class UserMigration1634036219341 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn("user", "salt");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
