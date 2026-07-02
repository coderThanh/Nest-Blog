import { endOfDay, startOfDay } from 'date-fns';

import { Category } from '@/modules/category/entities/category.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { DatabaseUltil } from '@/common/utils/database.util';
import { DatabaseValidate } from '@/common/utils/database-validate.util';
import { DbValidateService } from '@/prisma/db-validate.service';
import { FileEntity } from '@/modules/file/entities/file.entity';
import { FindAllPostDto } from '@/modules/post/dto/find-all-post.dto';
import { Injectable } from '@nestjs/common';
import { PostEntity } from '@/modules/post/entities/post.entity';
import { PostRepository } from '@/modules/post/post.repository';
import { Prisma } from '@prisma/client';
import { Tag } from '@/modules/tag/entities/tag.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '@/modules/user/entities/user.entity';
import { removeVietnameseAccents } from '@/common/utils/helper.util';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly dbValidate: DbValidateService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    await DatabaseValidate.validateOrThrow([
      //
      createPostDto.categoryIds &&
        this.dbValidate.validateRecordExistOrThrow(
          Prisma.ModelName.Category,
          createPostDto.categoryIds,
          'categoryIds',
        ),
      //
      createPostDto.tagIds &&
        this.dbValidate.validateRecordExistOrThrow(
          Prisma.ModelName.Tag,
          createPostDto.tagIds,
          'tagIds',
        ),
    ]);

    const slug = await this.dbValidate.generateUniqueSlugOrThrow({
      modelName: Prisma.ModelName.Post,
      fieldName: 'slug',
      slug: createPostDto.slug,
      columnName: Prisma.TagScalarFieldEnum.slug,
    });

    return await this.postRepo.create({
      ...createPostDto,
      slug: slug,
    });
  }

  async findAll(query: FindAllPostDto) {
    return this.postRepo.findMany(PostService.getCommonFindAllOptions(query));
  }

  async findAllAndCount(query: FindAllPostDto) {
    return this.postRepo.findManyAndCount(
      PostService.getCommonFindAllOptions(query),
    );
  }

  findOne(slug: string) {
    return this.postRepo.findUnique({
      where: { slug },
      include: {
        ...PostService.getCommonIncludeArg,
        tags: { select: Tag.selectRelation },
      },
    });
  }

  findOneOrThrow(slug: string) {
    return this.postRepo.findUniqueOrThrow({
      where: { slug },
      include: {
        ...PostService.getCommonIncludeArg,
        tags: { select: Tag.selectRelation },
      },
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const curr = await this.postRepo.findUniqueOrThrow({
      where: { id },
      select: { slug: true, id: true },
    });

    // validate
    await DatabaseValidate.validateOrThrow([
      //
      updatePostDto.categoryIds &&
        this.dbValidate.validateRecordExistOrThrow(
          Prisma.ModelName.Category,
          updatePostDto.categoryIds,
          'categoryIds',
        ),
      //
      updatePostDto.tagIds &&
        this.dbValidate.validateRecordExistOrThrow(
          Prisma.ModelName.Tag,
          updatePostDto.tagIds,
          'tagIds',
        ),
    ]);

    const slug =
      updatePostDto.slug && curr.slug !== updatePostDto.slug
        ? await this.dbValidate.generateUniqueSlugOrThrow({
            modelName: Prisma.ModelName.Post,
            fieldName: 'slug',
            slug: updatePostDto.slug,
            columnName: Prisma.TagScalarFieldEnum.slug,
            valueWhereMore: { id: { not: id } },
          })
        : undefined;

    return await this.postRepo.patch(curr.id, {
      ...updatePostDto,
      slug,
    });
  }

  async remove(id: string) {
    await this.postRepo.findUniqueOrThrow({ where: { id } });
    return await this.postRepo.delete(id);
  }

  static getCommonIncludeArg: Prisma.PostInclude = {
    thumbnail: { select: FileEntity.selectRelation },
    categories: { select: Category.selectCategoryRelation },
    createdByUser: { select: User.selectRelation },
  };

  static getCommonFindAllWhere(query: FindAllPostDto): Prisma.PostWhereInput[] {
    const {
      ids,
      excludeIds,
      categoryIds,
      tagIds,
      categoryPath,
      search,
      fromDate,
      toDate,
      createdBy,
    } = query;

    const andCondition: Prisma.PostWhereInput[] = [];

    console.log(categoryIds, categoryIds === null);
    console.log(tagIds, tagIds === null);

    if (ids?.length) andCondition.push({ id: { in: ids } });

    if (excludeIds?.length) andCondition.push({ id: { notIn: excludeIds } });

    if (categoryIds)
      andCondition.push({ categories: { some: { id: { in: categoryIds } } } });

    if (tagIds) andCondition.push({ tags: { some: { id: { in: tagIds } } } });

    if (categoryPath)
      andCondition.push({
        categories: { some: { path: { startsWith: categoryPath } } },
      });

    if (search)
      andCondition.push({
        search: { contains: removeVietnameseAccents(search).toLowerCase() },
      });

    if (createdBy !== undefined)
      andCondition.push({
        createdBy: createdBy,
      });

    if (fromDate) {
      andCondition.push({
        createdAt: { gte: startOfDay(new Date(fromDate)) },
      });
    }

    if (toDate) {
      andCondition.push({
        createdAt: { lt: endOfDay(new Date(toDate)) },
      });
    }

    return andCondition;
  }

  static getCommonFindAllOptions(
    query: FindAllPostDto,
  ): Prisma.PostFindManyArgs {
    const { page, limit, orderDir, orderBy } = query;

    const order: Prisma.PostOrderByWithRelationInput = {
      [orderBy as Prisma.PostScalarFieldEnum]: orderDir,
    };

    return {
      where: { AND: this.getCommonFindAllWhere(query) },
      select: {
        ...PostEntity.selectFindAll,
        ...PostService.getCommonIncludeArg,
      },
      orderBy: order,
      take: limit,
      skip: DatabaseUltil.getSkip(page, limit),
    };
  }
}
