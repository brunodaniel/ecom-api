import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from '@prisma/client';
import { CreateBookDto } from './dto/create-book.dto';
import { CreateManyBooksDto } from './dto/create-many-book.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('book')
@Controller('book')
export class BookController {
  service: any;
  constructor(private readonly bookService: BookService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Criar um livro',
  })
  create(@Body() data: CreateBookDto): Promise<Book> {
    return this.bookService.create(data);
  }

  @Post('createMany')
  @ApiOperation({
    summary: 'Criar vários livros',
  })
  async createMany(@Body() data: CreateManyBooksDto) {
    return this.service.createMany(data);
  }

  @Get('findMany')
  @ApiOperation({
    summary: 'Listar todos os livros cadastrados',
  })
  findMany(): Promise<Book[]> {
    return this.service.findMany();
  }

  @Get('find/:id')
  @ApiOperation({
    summary: 'Procurar um livro pelo ID',
  })
  async findUnique(@Param('id') id: string): Promise<Book> {
    return this.service.findUnique(id);
  }

  @UseGuards(AuthGuard())
  @Patch('update/:id')
  @ApiOperation({
    summary: 'Atualizar um livro pelo ID',
  })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() data: UpdateBookDto): Promise<Book> {
    return this.service.update(id, data);
  }

  @UseGuards(AuthGuard())
  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Deletar um livro pelo ID',
  })
  @ApiBearerAuth()
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.service.delete(id);
  }
}
