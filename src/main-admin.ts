import { NestFactory } from '@nestjs/core';
import { AppAdminModule } from './app-admin.module';

async function bootstrap() {
  const app = await NestFactory.create(AppAdminModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
