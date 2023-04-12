import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService();

  app.enableCors();
  app.setGlobalPrefix('api/v1');
  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
