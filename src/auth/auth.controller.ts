import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, AuthResponse } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from './auth-user.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Fazer login com um user e gerar um token',
  })
  login(@Body() data: LoginDto): Promise<AuthResponse> {
    return this.authService.login(data);
  }

  @UseGuards(AuthGuard())
  @Get('profile')
  @ApiOperation({
    summary: 'Pegar user logado no momento',
  })
  profile(@AuthUser() user: User) {
    return user;
  }
}
