import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { Connection, DatabaseType, getRepository } from 'typeorm';
import {
  Builder,
  fixturesIterator,
  Loader,
  Parser,
  Resolver,
} from 'typeorm-fixtures-cli/dist';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class TestUtils {
  /**
   * Create an instance of the nest application with the modules passed as parameters
   * @param modules The modules whit which the app shall be instantiated
   */
  public static async initializeApp(
    modules?: Array<any>,
  ): Promise<INestApplication> {
    console.log(__dirname + '/**/*.entity{.ts,.js}');
    const defaultImports = [
      ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return {
            type: configService.get<DatabaseType>('DB_TEST_TYPE'),
            host: configService.get<string>('DB_TEST_HOST'),
            port: parseInt(configService.get<string>('DB_TEST_PORT')),
            username: configService.get<string>('DB_TEST_USERNAME'),
            password: configService.get<string>('DB_TEST_PASSWORD'),
            database: configService.get<string>('DB_TEST_DATABASE'),
            autoLoadEntities: true,
            synchronize: true,
          } as PostgresConnectionOptions;
        },
        inject: [ConfigService],
      }),
    ];

    const testingModule = await Test.createTestingModule({
      imports: modules.length ? defaultImports.concat(modules) : defaultImports,
    }).compile();

    const app: INestApplication = testingModule.createNestApplication();
    await app.init();
    return app;
  }

  static async reloadFixtures(
    app: INestApplication,
    fixturesPath = 'test/fixtures/',
  ) {
    const connection = app.get(Connection);
    // Synchronize will clear the DB at each execution
    await connection.synchronize(true);

    const fixtures = TestUtils.loadFixture(fixturesPath);
    const builder = new Builder(connection, new Parser());

    for (const fixture of fixturesIterator(fixtures)) {
      const entity = await builder.build(fixture);
      await getRepository(entity.constructor.name).save(entity);
    }
  }

  private static loadFixture(fixturesPath: string) {
    const loader = new Loader();
    loader.load(path.resolve(fixturesPath));
    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    return fixtures;
  }
}
