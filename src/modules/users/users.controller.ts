import { compare } from 'bcrypt';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  ParseUUIDPipe,
  Put,
  BadRequestException,
  UseInterceptors,
  ClassSerializerInterceptor,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from './user.create.dto';
import { UpdateUserDto } from './user.update.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  private USER_NOT_FOUND = 'User not found';

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  all() {
    return this.usersService.all();
  }

  @Get(':id')
  get(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const user = this.usersService.find(id);

    if (!user) {
      throw new NotFoundException(this.USER_NOT_FOUND);
    }

    return user;
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() { oldPassword, newPassword }: UpdateUserDto,
  ) {
    if (newPassword === oldPassword) {
      throw new BadRequestException(
        'The new password is identical to previous one',
      );
    }

    const user = this.usersService.find(id);

    if (!(await compare(oldPassword, user.password))) {
      throw new ForbiddenException('Passwords dont match');
    }

    return this.usersService.update(id, {
      password: newPassword,
      version: user.version + 1,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const user = this.usersService.delete(id);

    if (!user) {
      throw new NotFoundException(this.USER_NOT_FOUND);
    }

    return user;
  }
}
