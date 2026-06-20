import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { TransformResponseOkInterceptor } from '@/common/interceptor/transfrom-response-ok.interceptor';
import { setupSwagger } from 'src/config/swagger.config';

// Fix BigInt serialization
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  setupSwagger(app);

  //
  app.useGlobalInterceptors(new TransformResponseOkInterceptor());

  // Pipes
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
