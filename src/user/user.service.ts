import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

import * as bcrypt from 'bcrypt';

import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private database: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const emailOrNickExists = await this.database.user.findFirst({
      where: {
        OR: [
          {
            email: data.email,
          },
          {
            nickname: data.nickname,
          },
        ],
      },
    });

    if (emailOrNickExists) {
      throw new ConflictException('Email ou nickname já cadastrados');
    }

    if (data.password !== data.passwordConfirmation) {
      throw new ConflictException('Senhas não conferem');
    }

    delete data.passwordConfirmation;

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.database.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    delete user.password;
    return user;
  }

  async addList(user: User, bookId: string) {
    const book = await this.database.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('Jogo não encontrado');
    }

    const userLikeBook = await this.database.user.findUnique({
      where: { id: user.id },
      include: {
        books: true,
      },
    });

    const userBooksList = userLikeBook.books;
    let foundBook = false;

    // se o usuário curtiu o jogo, foundBook tem que ser true
    userBooksList.map((book) => {
      if (book.id === bookId) {
        foundBook = true;
      }
    });

    // se ele achou o jogo eu tenho que discurtir o jogo
    if (foundBook) {
      await this.database.user.update({
        where: { id: user.id },
        data: {
          books: {
            disconnect: {
              id: book.id,
            },
          },
        },
      });
      return { message: 'Jogo removido da lista ' };
    } else {
      await this.database.user.update({
        where: { id: user.id },
        data: {
          books: {
            connect: {
              id: book.id,
            },
          },
        },
      });
      return { message: 'Jogo adicionado na lista' };
    }
  }

  async update(user: User, data: UpdateUserDto): Promise<User> {
    const userUpdated = await this.database.user.update({
      data: data,
      where: { id: user.id },
    });

    delete userUpdated.password;

    return userUpdated;
  }

  async delete(user: User): Promise<{ message: string }> {
    const userExists = await this.database.user.findUnique({
      where: { id: user.id },
    });

    if (!userExists) {
      throw new NotFoundException(
        'Usuário com o ID informado não foi encontrado',
      );
    } else {
      await this.database.user.delete({
        where: { id: user.id },
      });
    }

    return {
      message: 'Id foi encontrado e deletado com sucesso',
    };
  }
}
