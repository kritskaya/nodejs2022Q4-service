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
import { validate } from 'uuid';
import { CreateUserDTO } from './dto/user.dto';
import { UpdatePasswordDTO } from './dto/password.dto';
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
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserResponse> {
    // if (!validate(params.id)) {
    //   throw new HttpException(
    //     'Specified id is invalid',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    const user = await this.userService.findOne(id);

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
  async create(@Body(ValidationPipe) dto: CreateUserDTO): Promise<UserResponse> {
    // if (
    //   typeof createUserDTO.login !== 'string' ||
    //   typeof createUserDTO.password !== 'string'
    // ) {
    //   throw new HttpException('Invalid data format', HttpStatus.BAD_REQUEST);
    // }

    const newUser = this.userService.create(dto);
    const { password, ...userResponse } = newUser;

    return userResponse;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updatePasswordDTO: UpdatePasswordDTO,
  ): Promise<UserResponse> {
    // if (!validate(params.id)) {
    //   throw new HttpException(
    //     'Specified id is invalid',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    // if (!updatePasswordDTO.oldPassword || !updatePasswordDTO.newPassword) {
    //   throw new HttpException('Invalid data format', HttpStatus.BAD_REQUEST);
    // }

    const user = this.userService.findOne(id);
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
    // if (!validate(params.id)) {
    //   throw new HttpException(
    //     'Specified id is invalid',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

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
