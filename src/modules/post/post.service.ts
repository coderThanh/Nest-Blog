import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseUltil, ValidateMessage } from '@/common/ultils';

import { Category } from '@/modules/category/entities/category.entity';
import { CategoryRepository } from '@/modules/category/category.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { FileEntity } from '@/modules/file/entities/file.entity';
import { PostRepository } from '@/modules/post/post.repository';
import { Prisma } from '@prisma/client';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '@/modules/user/entities/user.entity';
import { notEqual } from 'node:assert';

@Injectable()
export class PostService {
  constructor(private readonly postRepo: PostRepository) {}

  async create(createPostDto: CreatePostDto) {
    const slug = await this.generateSlugOrThrow(createPostDto.slug);

    return await this.postRepo.create({
      ...createPostDto,
      slug: slug,
      createdBy: null, // TODO fix lated
    });
  }

  findAll() {
    return `This action returns all post`;
  }

  findAllAndCount() {
    return `This action returns all post`;
  }

  findOne(slug: string) {
    return this.postRepo.findUnique({
      where: { slug },
      include: {
        categories: { select: Category.selectCategoryRelation },
        thumbnail: { select: FileEntity.selectRelation },
        createdByUser: { select: User.selectRelation },
      },
    });
  }

  async update(slug: string, updatePostDto: UpdatePostDto) {
    const curr = await this.postRepo.findUniqueOrThrow({
      where: { slug },
      select: { slug: true, id: true },
    });

    let newSlug: string | undefined;

    if (updatePostDto.slug && curr.slug !== updatePostDto.slug) {
      newSlug = await this.generateSlugOrThrow(updatePostDto.slug, curr.id);
    }

    return await this.postRepo.patch(curr.id, {
      ...updatePostDto,
      slug: newSlug,
    });
  }

  async remove(id: string) {
    return await this.postRepo.delete(id);
  }

  private async generateSlugOrThrow(defaultSlug: string, id?: string) {
    const findRecordBySlug = async (slug: string) => {
      return await this.postRepo.findFirst({
        where: { slug, id: id ? { not: id } : undefined },
        select: { id: true },
      });
    };

    return DatabaseUltil.generateSlugFromDBOrthrow(
      defaultSlug,
      findRecordBySlug,
      Prisma.PostScalarFieldEnum.slug,
    );
  }
}
