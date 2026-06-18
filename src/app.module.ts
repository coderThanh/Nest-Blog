import { appConfiguration, configValidationSchema } from '@/config/app.config';

import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@/common/exception/all-exception-filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PostModule } from '@/modules/post/post.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfiguration],
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    PrismaModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
