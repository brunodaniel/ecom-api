import { CreateBookDto } from './create-book.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateManyBooksDto {
  @IsNotEmpty()
  @ApiProperty()
  books: CreateBookDto[];
}
