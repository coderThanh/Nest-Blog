import { CreateFileDto } from './create-file.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateFileDto extends PartialType(CreateFileDto) {}
