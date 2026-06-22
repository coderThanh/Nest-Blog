import { BadRequestException, Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { DatabaseUltil, ValidateMessage } from '@/common/ultils';

import { CategoryRepository } from '@/modules/category/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindAllCategoryDto } from '@/modules/category/dto/find-all-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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

  async findAll(query: FindAllCategoryDto = {}) {
    return query;
    return `This action returns all category`;
  }

  async findOne(slug: string) {
    return this.categoryRepo.findUniqueOrThrow({
      where: { slug },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const current = await this.categoryRepo.findUniqueOrThrow({
      where: { id },
    });

    if (id === updateCategoryDto.parentId) {
      throw new BadRequestException(
        ValidateMessage.exceptionThrowErrorsField(
          Prisma.CategoryScalarFieldEnum.parentId,
          ValidateMessage.isNotSeft().rawMsg(),
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

    await DatabaseUltil.validateUniqueName(fnCheck, 'name');
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

    return await DatabaseUltil.generateSlugFromDBOrthrow(
      defaultSlug,
      findRecordBySlug,
      'slug',
    );
  }
}
