import { appConfiguration, configValidationSchema } from '@/config/app.config';

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
  providers: [AppService],
})
export class AppModule {}
