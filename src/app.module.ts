import { appConfiguration, configValidationSchema } from '@/config/app.config';

import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@/common/exception/all-exception-filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './modules/category/category.module';
import { ClsModule } from 'nestjs-cls';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FileModule } from './modules/file/file.module';
import { Module } from '@nestjs/common';
import { PostModule } from '@/modules/post/post.module';
import { PrismaClientExceptionFilter } from './common/exception/prisma-exception.filter';
import { PrismaModule } from '@/prisma/prisma.module';
import { TagModule } from './modules/tag/tag.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfiguration],
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({
      // Đặt true nếu bạn muốn dùng wildcard (*) trong tên event (ví dụ: 'user.*')
      wildcard: false,
      // Phục vụ cho việc debug, hiển thị thông tin chi tiết của event nếu có lỗi
      verboseMemoryLeak: true,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        // setup: (cls, req) => {},
      },
    }),
    PrismaModule,
    PostModule,
    CategoryModule,
    FileModule,
    UserModule,
    TagModule,
    RoleModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
  ],
})
export class AppModule {}
