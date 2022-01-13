import {
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser } from '../auth/auth-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Criar um usuário',
  })
  create(@Body() data: CreateUserDto): Promise<User> {
    return this.service.create(data);
  }

  @UseGuards(AuthGuard())
  @Patch('addList/:id')
  @ApiOperation({
    summary: 'Adicionar um jogo na lista de um usuário, ou remover',
  })
  @ApiBearerAuth()
  addList(@AuthUser() user: User, @Param('id') bookId: string) {
    return this.service.addList(user, bookId);
  }

  @UseGuards(AuthGuard())
  @Patch('update')
  @ApiOperation({
    summary: 'Atualizar o usuário autenticado',
  })
  @ApiBearerAuth()
  update(@AuthUser() user: User, @Body() data: UpdateUserDto): Promise<User> {
    return this.service.update(user, data);
  }

  @UseGuards(AuthGuard())
  @Delete('delete')
  @ApiOperation({
    summary: 'Deletar o usuário autenticado',
  })
  @ApiBearerAuth()
  delete(@AuthUser() user: User): Promise<{ message: string }> {
    return this.service.delete(user);
  }
}
