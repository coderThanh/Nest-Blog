import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DatabaseUltil,
  DatabaseValidate,
  ValidateMessage,
  removeVietnameseAccents,
} from '@/common/ultils';

import { Category } from '@/modules/category/entities/category.entity';
import { CategoryOrderBy } from '@/modules/category/category.enum';
import { CategoryRepository } from '@/modules/category/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FileEntity } from '@/modules/file/entities/file.entity';
import { FindAllCategoryDto } from '@/modules/category/dto/find-all-category.dto';
import { OrderDir } from '@/common/enum';
import { Prisma } from '@prisma/client';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // check slug
    const slug = await this.getSlugUnqiueOrThrow(createCategoryDto.slug);

    // check unique parentId + name
    await this.validateUniqueName(
      createCategoryDto.name,
      createCategoryDto.parentId ?? null,
    );

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
    const current = await this.categoryRepo.findUniqueOrThrow({
      where: { id },
      select: { parentId: true, id: true, slug: true },
    });

    if (id === updateCategoryDto.parentId) {
      throw new BadRequestException(
        ValidateMessage.exceptionThrowErrorsField(
          Prisma.CategoryScalarFieldEnum.parentId,
          ValidateMessage.isNotSefl().rawMsg(),
        ),
      );
    }

    if (updateCategoryDto.name) {
      // Cần lấy parentId hiện tại hoặc từ DTO để validate

      await this.validateUniqueName(
        updateCategoryDto.name,
        updateCategoryDto.parentId !== undefined
          ? updateCategoryDto.parentId
          : (current.parentId ?? null),
        id,
      );
    }

    // check slug if new slug in body
    let uniqueSlugNew: string | undefined;

    if (updateCategoryDto.slug && current.slug !== updateCategoryDto.slug) {
      uniqueSlugNew = await this.getSlugUnqiueOrThrow(
        updateCategoryDto.slug,
        current.id,
      );
    }

    return await this.categoryRepo.patch(id, {
      ...updateCategoryDto,
      slug: uniqueSlugNew,
      createdBy: null,
    });
  }

  async remove(id: number) {
    return await this.categoryRepo.deleted(id);
  }

  private async validateUniqueName(
    name: string,
    parentId: number | null,
    id?: Category['id'],
  ) {
    const fnCheck = async () =>
      await this.categoryRepo.findFirst({
        where: {
          parentId: parentId ?? null,
          name: name,
          id: id
            ? {
                not: id,
              }
            : undefined,
        },
        select: { id: true },
      });

    await DatabaseValidate.validateUniqueName(fnCheck, 'name');
  }

  private async getSlugUnqiueOrThrow(
    defaultSlug: string,
    id?: number,
  ): Promise<string> {
    const findRecordBySlug = async (slug: string) => {
      return await this.categoryRepo.findFirst({
        where: { slug, id: id ? { not: id } : undefined },
        select: { id: true },
      });
    };

    return await DatabaseValidate.generateSlugFromDBOrthrow(
      defaultSlug,
      findRecordBySlug,
      Prisma.CategoryScalarFieldEnum.slug,
    );
  }

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
