import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserProfileService } from '@/modules/user/user-profile.service';
import { UserRepository } from '@/modules/user/user.repository';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, UserProfileService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
