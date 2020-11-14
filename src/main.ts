import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // TODO: activate swagger not in production
  // if (['development', 'staging'].includes(configService.nodeEnv)) {
  setupSwagger(app);
  // }
  
  await app.listen(3000);
}
bootstrap();
