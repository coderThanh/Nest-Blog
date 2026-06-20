import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseUltil, ValidateMessage } from '@/common/ultils';

import { CategoryRepository } from '@/modules/category/category.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { PostRepository } from '@/modules/post/post.repository';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepo: PostRepository) {}

  async create(createPostDto: CreatePostDto) {
    const findRecordBySlug = async (slug: string) => {
      return await this.postRepo.findUnique({
        where: { slug },
        select: { id: true },
      });
    };

    const slug = await DatabaseUltil.generateSlugFromDB(
      createPostDto.slug,
      findRecordBySlug,
    );

    if (!slug) {
      throw new BadRequestException(
        ValidateMessage.exceptionThrowErrorsField(
          'slug',
          ValidateMessage.wasExisted().rawMsg(),
        ),
      );
    }

    return await this.postRepo.create({
      ...createPostDto,
      slug: slug,
      createdBy: null, // TODO fix lated
    });
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
