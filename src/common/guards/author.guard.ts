import {
  AUDIT_MODELS,
  MODELS_HAS_ID_TYPE_INT,
  STATUS_MODELS,
} from '@/prisma/prisma.const';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PermissionScope, Prisma, RecordStatus } from '@prisma/client';

import { ClsService } from 'nestjs-cls';
import { DatabaseUltil } from '@/common/utils/database.util';
import { GlobalClsStore } from '@/shared/types/cls-store';
import { PrismaService } from '@/prisma/prisma.service';
import { Reflector } from '@nestjs/core';
import { ReflectorEnum } from '@/common/enum/reflector.enum';
import { ReqUserEmbed } from '@/shared/entities/auth.entity';
import { Request } from 'express';
import { ValidateMessage } from '@/common/utils/validate-message.util';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cls: ClsService<GlobalClsStore>,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const modelName = this.reflector.getAllAndOverride<Prisma.ModelName>(
      ReflectorEnum.checkAuthor,
      [context.getHandler(), context.getClass()],
    );

    if (!Prisma.ModelName[modelName]) {
      throw new ForbiddenException(
        `Developer vui lòng kiễm tra lại Model ${modelName} không tồn tại trong schema`,
      );
    }

    // check scope
    if (this.cls.get('permissionScope') === PermissionScope.SYSTEM) return true;

    // check author
    const request = context.switchToHttp().getRequest<Request>();

    const { userId } = request.user as ReqUserEmbed;
    let resourceId =
      (request.params.id as string) || (request.params.slug as string);

    if (!userId) {
      throw new ForbiddenException(ValidateMessage.forbidden());
    }

    if (!resourceId) {
      throw new ForbiddenException(
        `Yêu cầu ID để xác thực quyền trên tài nguyên`,
      );
    }

    const resource = await this.prisma.client[modelName].findUnique({
      where: {
        id: MODELS_HAS_ID_TYPE_INT.has(modelName)
          ? parseInt(resourceId)
          : resourceId,
      },
    });

    if (!resource) {
      throw new ForbiddenException(
        `Không tìm thấy tài nguyên đễ xác thực quyền`,
      );
    }

    if (!('createdBy' in resource)) {
      throw new ForbiddenException(
        `Developer vui lòng kiễm tra lại schema ${modelName}.createdBy`,
      );
    }

    // check author
    if (AUDIT_MODELS.has(modelName)) {
      const isOwner = resource.createdBy === userId;

      if (!isOwner) throw new ForbiddenException(ValidateMessage.forbidden());
    }

    // check status
    if (STATUS_MODELS.has(modelName)) {
      if (!('status' in resource)) {
        throw new ForbiddenException(
          `Developer vui lòng kiễm tra lại schema ${modelName}.status`,
        );
      }

      const canDoAction = DatabaseUltil.isStatusCanDoAction(
        resource.status as RecordStatus,
      );

      if (!canDoAction)
        throw new ForbiddenException(
          'Tài nguyên đang trang thái đóng bạn không thể thực hiện hành động này',
        );
    }

    return true;
  }
}
