import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleRepository } from '@/modules/role/role.repository';
import { RoleService } from './role.service';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleService],
})
export class RoleModule {}
