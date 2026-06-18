import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { setupSwagger } from 'src/config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  setupSwagger(app);

  //
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Ứng dụng đang chạy tại: http://localhost:${port}`);
}
bootstrap();
