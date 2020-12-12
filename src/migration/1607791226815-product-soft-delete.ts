import { MigrationInterface, QueryRunner } from 'typeorm';

export class productSoftDelete1607791226815 implements MigrationInterface {
  name = 'productSoftDelete1607791226815';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD "deletedDate" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "deletedDate"`);
  }
}
