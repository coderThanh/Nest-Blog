import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DatabaseUltil,
  DatabaseValidate,
  ValidateMessage,
  removeVietnameseAccents,
} from '@/common/ultils';
import { Prisma, PrismaClient } from '@prisma/client';

import { CreateTagDto } from './dto/create-tag.dto';
import { FindAllTagDto } from '@/modules/tag/dto/find-all-tag.dto';
import { Tag } from '@/modules/tag/entities/tag.entity';
import { TagRepository } from '@/modules/tag/tag.repository';
import { UpdateTagDto } from './dto/update-tag.dto';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class TagService {
  constructor(private readonly tagRepo: TagRepository) {}

  async create(createTagDto: CreateTagDto) {
    const slug = await this.generateSlugOrThrow(createTagDto.slug);

    await this.validateUniqueOrThrow({
      value: createTagDto.name,
      column: Prisma.TagScalarFieldEnum.name,
    });

    return this.tagRepo.create({
      ...createTagDto,
      createdBy: null,
      slug,
    });
  }

  async findAll(query: FindAllTagDto) {
    return this.tagRepo.findMany(TagService.getcommonFindAllInput(query));
  }

  async findAllAndCount(query: FindAllTagDto) {
    return this.tagRepo.findManyAndCount(
      TagService.getcommonFindAllInput(query),
    );
  }

  async findOne(slug: string) {
    return this.tagRepo.findUnique({
      where: { slug },
      include: { createdByUser: { select: User.selectRelation } },
    });
  }

  async findOneOrthrow(slug: string) {
    return this.tagRepo.findUniqueOrThrow({
      where: { slug },
      include: { createdByUser: { select: User.selectRelation } },
    });
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const record = await this.tagRepo.findUniqueOrThrow({
      where: { id },
      select: { slug: true, name: true },
    });

    let newSlug: string | undefined;

    if (updateTagDto.slug && record.slug !== updateTagDto.slug) {
      newSlug = await this.generateSlugOrThrow(updateTagDto.slug, id);
    }

    if (updateTagDto.name && updateTagDto.name !== record.name) {
      await this.validateUniqueOrThrow({
        value: updateTagDto.name,
        column: Prisma.TagScalarFieldEnum.name,
      });
    }

    return this.tagRepo.patch(id, {
      ...updateTagDto,
      slug: newSlug,
    });
  }

  async remove(id: string) {
    return this.tagRepo.delete(id);
  }

  static getInclueArg(): Prisma.TagInclude {
    return { createdByUser: { select: User.selectRelation } };
  }

  //
  private async generateSlugOrThrow(
    defaultSlug: string,
    id?: string,
  ): Promise<string> {
    const fnFind = async (slug: string) =>
      await this.tagRepo.findFirst({
        where: { slug, id: id ? { not: id } : undefined },
      });

    return await DatabaseValidate.generateSlugFromDBOrthrow(
      defaultSlug,
      fnFind,
      Prisma.TagScalarFieldEnum.slug,
    );
  }

  private async validateUniqueOrThrow(params: {
    value: any;
    column: Prisma.TagScalarFieldEnum;
    id?: string;
  }) {
    const { value, column, id } = params;

    const record = await this.tagRepo.findFirst({
      where: {
        [column]: value,
        id: id ? { not: id } : undefined,
      },
      select: { id: true },
    });

    if (record)
      throw new BadRequestException(
        ValidateMessage.exceptionThrowErrorsField(
          column,
          ValidateMessage.isUnique().rawMsg(),
        ),
      );
  }

  //
  static getcommonFindAllInput(query: FindAllTagDto): Prisma.TagFindManyArgs {
    const { page, limit, orderDir, orderBy } = query;
    const order: Prisma.TagOrderByWithRelationInput = {
      [orderBy as Prisma.TagScalarFieldEnum]: orderDir,
    };

    return {
      where: { AND: TagService.getCommonFindAllWhereArg(query) },
      select: {
        ...Tag.selectFindAll,
        createdByUser: { select: User.selectRelation },
      },
      orderBy: order,
      take: limit,
      skip: DatabaseUltil.getSkip(page, limit),
    };
  }

  static getCommonFindAllWhereArg(
    query: FindAllTagDto,
  ): Prisma.TagWhereInput[] {
    const { search, excludeIds, ids } = query;
    const andCondition: Prisma.TagWhereInput[] = [];

    if (search)
      andCondition.push({
        search: { contains: removeVietnameseAccents(search).toLowerCase() },
      });

    if (ids?.length) andCondition.push({ id: { in: ids } });
    if (excludeIds?.length) andCondition.push({ id: { notIn: excludeIds } });

    return andCondition;
  }
}
