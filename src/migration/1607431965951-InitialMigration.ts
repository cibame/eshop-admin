import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1607431965951 implements MigrationInterface {
  name = 'InitialMigration1607431965951';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "detail" character varying, "ingredients" character varying, "description" character varying, "active" boolean NOT NULL DEFAULT true, "price" numeric NOT NULL, "image" character varying, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updateddDate" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" integer, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updateddDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "address" character varying NOT NULL, "telephone" character varying NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_199e32a02ddc0f47cd93181d8fd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "order_type_enum" AS ENUM('pickup', 'delivery')`,
    );
    await queryRunner.query(
      `CREATE TYPE "order_status_enum" AS ENUM('waiting-confirmation', 'confirmed', 'cancelled', 'delivered')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" SERIAL NOT NULL, "note" character varying NOT NULL, "type" "order_type_enum" NOT NULL DEFAULT 'pickup', "status" "order_status_enum" NOT NULL DEFAULT 'waiting-confirmation', "uuid" character varying NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_caabe91507b3379c7ba73637b8" UNIQUE ("userId"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_product" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "price" numeric NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "productId" integer, "orderId" integer, CONSTRAINT "PK_539ede39e518562dfdadfddb492" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "order_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_product" ADD CONSTRAINT "FK_073c85ed133e05241040bd70f02" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_product" ADD CONSTRAINT "FK_3fb066240db56c9558a91139431" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_product" DROP CONSTRAINT "FK_3fb066240db56c9558a91139431"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_product" DROP CONSTRAINT "FK_073c85ed133e05241040bd70f02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`,
    );
    await queryRunner.query(`DROP TABLE "order_product"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TYPE "order_status_enum"`);
    await queryRunner.query(`DROP TYPE "order_type_enum"`);
    await queryRunner.query(`DROP TABLE "order_user"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
