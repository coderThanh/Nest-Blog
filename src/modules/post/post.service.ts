import { DatabaseUltil } from '@/common/ultils/database.ultil';
import { removeVietnameseAccents } from '@/common/ultils/helper';

import { Category } from '@/modules/category/entities/category.entity';
import { CreatePostDto } from './dto/create-post.dto';
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

@Injectable()
export class PostService {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly dbValidate: DbValidateService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const [slug] = await Promise.all([
      // check slug
      this.dbValidate.generateUniqueSlugOrThrow({
        modelName: Prisma.ModelName.Post,
        fieldName: 'slug',
        slug: createPostDto.slug,
        columnName: Prisma.TagScalarFieldEnum.slug,
      }),
      //
      createPostDto.categoryIds &&
        this.dbValidate.validateExistOrThrow(
          Prisma.ModelName.Category,
          createPostDto.categoryIds,
          'categoryIds',
        ),
      //
      createPostDto.tagIds &&
        this.dbValidate.validateExistOrThrow(
          Prisma.ModelName.Tag,
          createPostDto.tagIds,
          'tagIds',
        ),
    ]);

    return await this.postRepo.create({
      ...createPostDto,
      slug: slug,
      createdBy: null, // TODO fix lated
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
    const [slug] = await Promise.all([
      // check slug
      updatePostDto.slug && curr.slug !== updatePostDto.slug
        ? this.dbValidate.generateUniqueSlugOrThrow({
            modelName: Prisma.ModelName.Post,
            fieldName: 'slug',
            slug: updatePostDto.slug,
            columnName: Prisma.TagScalarFieldEnum.slug,
            valueWhereMore: { id: { not: id } },
          })
        : undefined,
      //
      updatePostDto.categoryIds &&
        this.dbValidate.validateExistOrThrow(
          Prisma.ModelName.Category,
          updatePostDto.categoryIds,
          'categoryIds',
        ),
      //
      updatePostDto.tagIds &&
        this.dbValidate.validateExistOrThrow(
          Prisma.ModelName.Tag,
          updatePostDto.tagIds,
          'tagIds',
        ),
    ]);

    return await this.postRepo.patch(curr.id, {
      ...updatePostDto,
      slug,
    });
  }

  async remove(id: string) {
    return await this.postRepo.delete(id);
  }

  static getCommonIncludeArg: Prisma.PostInclude = {
    thumbnail: { select: FileEntity.selectRelation },
    categories: { select: Category.selectCategoryRelation },
    createdByUser: { select: User.selectRelation },
  };

  static getCommonFindAllWhere(query: FindAllPostDto): Prisma.PostWhereInput[] {
    const { ids, excludeIds, categoryIds, categoryPath, search } = query;

    const andCondition: Prisma.PostWhereInput[] = [];

    if (ids?.length) andCondition.push({ id: { in: ids } });

    if (excludeIds?.length) andCondition.push({ id: { notIn: excludeIds } });

    if (categoryIds?.length)
      andCondition.push({ categories: { some: { id: { in: categoryIds } } } });

    if (categoryPath)
      andCondition.push({
        categories: { some: { path: { startsWith: categoryPath } } },
      });

    if (search)
      andCondition.push({
        search: { contains: removeVietnameseAccents(search).toLowerCase() },
      });

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
