import { APP_VERSION_CODE, APP_VERSION_PREFIX } from '@/common/constant/util';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { TransformResponseOkInterceptor } from '@/common/interceptor/transfrom-response-ok.interceptor';
import { getUrl } from '@/common/utils/helper.util';
import { setupSwagger } from 'src/config/swagger.config';

// Fix BigInt serialization
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  // versiont
  app.setGlobalPrefix(APP_VERSION_PREFIX);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: APP_VERSION_CODE,
  });

  //
  app.enableShutdownHooks();

  // swagger
  setupSwagger(app);

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

  let url = await getUrl(app);

  logger.log(`🚀 Ứng dụng đang chạy tại: ${url}`);
  logger.log(
    `🚀 API đang chạy tại: ${url}/${APP_VERSION_PREFIX}/v${APP_VERSION_CODE}`,
  );
}

bootstrap();
