import {
  Controller,
  Get,
  Put,
  Param,
  HttpException,
  HttpStatus,
  Post,
  Body,
  Delete,
  HttpCode,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/user.dto';
import { UpdatePasswordDTO } from './dto/password.dto';
import { UserResponse } from './types/user-response';
import { UserService } from './user.service';
import { User } from 'prisma/prisma-client';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserResponse> {
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new HttpException(
        'User with specified id not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  @Post()
  async create(
    @Body(ValidationPipe) dto: CreateUserDTO,
  ): Promise<UserResponse> {
    const newUser = await this.userService.create(dto);

    return {
      id: newUser.id,
      login: newUser.login,
      version: newUser.version,
      createdAt: newUser.createdAt.getTime(),
      updatedAt: newUser.updatedAt.getTime(),
    };
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updatePasswordDTO: UpdatePasswordDTO,
  ): Promise<UserResponse> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new HttpException(
        'User with specified id not found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.password !== updatePasswordDTO.oldPassword) {
      throw new HttpException(
        'user or password is invalid',
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedUser = await this.userService.update(
      user.id,
      updatePasswordDTO,
    );

    return {
      id: updatedUser.id,
      login: updatedUser.login,
      version: updatedUser.version,
      createdAt: updatedUser.createdAt.getTime(),
      updatedAt: updatedUser.updatedAt.getTime(),
    };
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new HttpException(
        'User with specified id not found',
        HttpStatus.NOT_FOUND,
      );
    }

    this.userService.delete(user.id);
    return;
  }
}
