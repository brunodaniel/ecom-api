import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { CreateManyBooksDto } from './dto/create-many-book.dto';
import { Book } from '@prisma/client';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(private database: PrismaService) {}

  async create(data: CreateBookDto): Promise<Book> {
    const book = await this.database.book.create({
      data,
    });
    return book;
  }

  async createMany(data: CreateManyBooksDto) {
    const createdBooks = [];
    data.books.map(async (book) => {
      const bookExist = await this.findPerName(book.name);
      if (!bookExist) {
        const created = await this.create(book);
        createdBooks.push(created);
      }
    });
    return createdBooks;
  }

  async findPerName(name: string): Promise<Book> {
    const book = await this.database.book.findFirst({
      where: { name: name },
    });
    return book;
  }

  async findMany(): Promise<Book[]> {
    const books = await this.database.book.findMany();
    return books;
  }

  async findUnique(id: string): Promise<Book> {
    const book = await this.database.book.findUnique({
      where: { id },
    });
    if (!book) {
      throw new NotFoundException('ID não encontrado');
    }

    return book;
  }

  async update(id: string, data: UpdateBookDto): Promise<Book> {
    const book = await this.database.book.update({
      data: data,
      where: { id },
    });
    return book;
  }

  async delete(id: string): Promise<{ message: string }> {
    const bookExists = await this.database.book.findUnique({
      where: { id },
    });

    if (!bookExists) {
      throw new NotFoundException(
        'Filme com o ID informado não foi encontrado',
      );
    } else {
      await this.database.book.delete({
        where: { id },
      });
    }

    return { message: 'Id foi encontrado e deletado ' };
  }
} //BookService
