import { BadRequestException, Injectable } from '@nestjs/common';

import { Category } from '@/modules/category/entities/category.entity';
import { CategoryOrderBy } from '@/modules/category/category.enum';
import { CategoryRepository } from '@/modules/category/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { DatabaseUltil } from '@/common/utils/database.util';
import { DbValidateService } from '@/prisma/db-validate.service';
import { FileEntity } from '@/modules/file/entities/file.entity';
import { FindAllCategoryDto } from '@/modules/category/dto/find-all-category.dto';
import { OrderDir } from '@/common/enum/filter.enum';
import { Prisma } from '@prisma/client';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { User } from '@/modules/user/entities/user.entity';
import { ValidateMessage } from '@/common/utils/validate-message.util';
import { removeVietnameseAccents } from '@/common/utils/helper.util';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepository,
    private readonly dbValidate: DbValidateService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const [slug] = await Promise.all([
      // check slug
      this.dbValidate.generateUniqueSlugOrThrow({
        modelName: Prisma.ModelName.Category,
        fieldName: 'slug',
        slug: createCategoryDto.slug,
        columnName: Prisma.TagScalarFieldEnum.slug,
      }),
      // check unique parentId + name
      this.dbValidate.validateUniqueOrThrow(
        Prisma.ModelName.Category,
        {
          name: createCategoryDto.name,
          parentId: createCategoryDto.parentId ?? null,
        },
        'name',
      ),
      //
      createCategoryDto.parentId &&
        this.dbValidate.validateExistOrThrow(
          Prisma.ModelName.Category,
          createCategoryDto.parentId,
          'parentId',
        ),
    ]);

    return await this.categoryRepo.create({
      ...createCategoryDto,
      slug,
      createdBy: null,
    });
  }

  async findAllAndCount(query: FindAllCategoryDto) {
    const { items, total } = await this.categoryRepo.findManyAndCount(
      this.getCommonFindAllOptions(query),
    );

    return {
      items,
      total,
    };
  }

  async findAll(query: FindAllCategoryDto) {
    return this.categoryRepo.findMany(this.getCommonFindAllOptions(query));
  }

  async findOne(slug: string) {
    return this.categoryRepo.findUnique({
      where: { slug },
      include: CategoryService.getCommonIncludeArg(),
    });
  }

  async findOneOrThrow(slug: string) {
    return this.categoryRepo.findUniqueOrThrow({
      where: { slug },
      include: CategoryService.getCommonIncludeArg(),
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    //
    if (id === updateCategoryDto.parentId) {
      throw new BadRequestException(
        ValidateMessage.exceptionThrowErrorsField(
          Prisma.CategoryScalarFieldEnum.parentId,
          ValidateMessage.isNotSefl().rawMsg(),
        ),
      );
    }

    const current = await this.categoryRepo.findUniqueOrThrow({
      where: { id },
      select: { parentId: true, id: true, slug: true },
    });

    const [slug] = await Promise.all([
      // check slug
      updateCategoryDto.slug && current.slug !== updateCategoryDto.slug
        ? this.dbValidate.generateUniqueSlugOrThrow({
            modelName: Prisma.ModelName.Category,
            fieldName: 'slug',
            slug: updateCategoryDto.slug,
            columnName: Prisma.TagScalarFieldEnum.slug,
            valueWhereMore: { id: { not: id } },
          })
        : undefined,

      // Cần lấy parentId hiện tại hoặc từ DTO để validate
      updateCategoryDto.name &&
        this.dbValidate.validateUniqueOrThrow(
          Prisma.ModelName.Category,
          {
            name: updateCategoryDto.name,
            parentId:
              updateCategoryDto.parentId !== undefined
                ? updateCategoryDto.parentId
                : (current.parentId ?? null),
            id: { not: id },
          },
          'name',
        ),
      //
      updateCategoryDto.parentId &&
        updateCategoryDto.parentId !== current.parentId &&
        this.dbValidate.validateExistOrThrow(
          Prisma.ModelName.Category,
          updateCategoryDto.parentId,
          'parentId',
        ),
    ]);

    return await this.categoryRepo.patch(id, {
      ...updateCategoryDto,
      slug: slug,
      createdBy: null,
    });
  }

  async remove(id: number) {
    return await this.categoryRepo.deleted(id);
  }

  //
  public static getFindManyWhere(
    query: FindAllCategoryDto,
  ): Prisma.CategoryWhereInput | undefined {
    const { ids, excludeIds, search, parentId } = query;

    const andCondition: Prisma.CategoryWhereInput[] = [];

    if (parentId !== undefined) andCondition.push({ parentId: parentId });

    if (ids?.length) andCondition.push({ id: { in: ids } });

    if (excludeIds?.length) andCondition.push({ id: { notIn: excludeIds } });

    if (search)
      andCondition.push({
        search: { contains: removeVietnameseAccents(search).toLowerCase() },
      });

    const where: Prisma.CategoryWhereInput = { AND: andCondition };

    return where;
  }

  public static getOrderBy(
    orderBy: CategoryOrderBy,
    orderDir: OrderDir,
  ): Prisma.CategoryOrderByWithRelationInput {
    return {
      [orderBy]: orderDir,
    };
  }

  private getCommonFindAllOptions(
    query: FindAllCategoryDto,
  ): Prisma.CategoryFindManyArgs {
    const { orderBy, orderDir, page, limit } = query;

    return {
      where: CategoryService.getFindManyWhere(query),
      select: {
        ...Category.selectCategoryFindAll,
        ...CategoryService.getCommonIncludeArg(),
      },

      orderBy: CategoryService.getOrderBy(orderBy, orderDir),
      take: limit,
      skip: DatabaseUltil.getSkip(page, limit),
    };
  }

  static getCommonIncludeArg(): Prisma.CategoryInclude {
    return {
      parent: { select: Category.selectCategoryRelation },
      thumbnail: { select: FileEntity.selectRelation },
      createdByUser: { select: User.selectRelation },
    };
  }
}
