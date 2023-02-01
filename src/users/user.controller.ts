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
} from '@nestjs/common';
import { validate } from 'uuid';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { User } from './interfaces/user.interface';
import { UserResponse } from './types/user-response';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params): Promise<UserResponse> {
    if (!validate(params.id)) {
      throw new HttpException(
        'Specified id is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.findOne(params.id);

    if (!user) {
      throw new HttpException(
        'User with specified id not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const { password, ...userResponse } = user;

    return userResponse;
  }

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO): Promise<UserResponse> {
    if (!createUserDTO.login || !createUserDTO.password) {
      throw new HttpException('Invalid data format', HttpStatus.BAD_REQUEST);
    }

    const newUser = this.userService.create(createUserDTO);
    const { password, ...userResponse } = newUser;

    return userResponse;
  }

  @Put(':id')
  async update(
    @Param() params,
    @Body() updatePasswordDTO: UpdatePasswordDTO,
  ): Promise<UserResponse> {
    if (!validate(params.id)) {
      throw new HttpException(
        'Specified id is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!updatePasswordDTO.oldPassword || !updatePasswordDTO.newPassword) {
      throw new HttpException('Invalid data format', HttpStatus.BAD_REQUEST);
    }

    const user = this.userService.findOne(params.id);
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

    const updatedUser = this.userService.update(user.id, updatePasswordDTO);

    const { password, ...userResponse } = updatedUser;
    return userResponse;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param() params) {
    if (!validate(params.id)) {
      throw new HttpException(
        'Specified id is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = this.userService.findOne(params.id);
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
