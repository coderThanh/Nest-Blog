import { CreateTagDto } from './dto/create-tag.dto';
import { DatabaseUltil } from '@/common/utils/database.util';
import { DbValidateService } from '@/prisma/db-validate.service';
import { FindAllTagDto } from '@/modules/tag/dto/find-all-tag.dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Tag } from '@/modules/tag/entities/tag.entity';
import { TagRepository } from '@/modules/tag/tag.repository';
import { UpdateTagDto } from './dto/update-tag.dto';
import { User } from '@/modules/user/entities/user.entity';
import { removeVietnameseAccents } from '@/common/utils/helper.util';

@Injectable()
export class TagService {
  constructor(
    private readonly tagRepo: TagRepository,
    private readonly dbValidate: DbValidateService,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const [slug] = await Promise.all([
      this.dbValidate.generateUniqueSlugOrThrow({
        modelName: Prisma.ModelName.Tag,
        fieldName: 'slug',
        slug: createTagDto.slug,
        columnName: Prisma.TagScalarFieldEnum.slug,
      }),

      //
      this.dbValidate.validateUniqueOrThrow(
        Prisma.ModelName.Tag,
        {
          name: createTagDto.name,
        },
        'name',
      ),
    ]);

    return this.tagRepo.create({
      ...createTagDto,
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
      newSlug = await this.dbValidate.generateUniqueSlugOrThrow({
        modelName: Prisma.ModelName.Tag,
        fieldName: 'slug',
        slug: updateTagDto.slug,
        columnName: Prisma.TagScalarFieldEnum.slug,
        valueWhereMore: {
          id: { not: id },
        },
      });
    }

    if (updateTagDto.name && updateTagDto.name !== record.name) {
      await this.dbValidate.validateUniqueOrThrow(
        Prisma.ModelName.Tag,
        {
          name: updateTagDto.name,
        },
        'name',
      );
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
