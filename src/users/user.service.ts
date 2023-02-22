import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/user.dto';
import { UpdatePasswordDTO } from './dto/password.dto';
import { User } from 'prisma/prisma-client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  async findOneByUsername(login: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        login,
      },
    });
    return user;
  }

  async create(userDTO: CreateUserDTO): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        login: userDTO.login,
        password: userDTO.password,
        version: 1,
      },
    });

    return newUser;
  }

  async update(id: string, passwordDTO: UpdatePasswordDTO): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: passwordDTO.newPassword,
        version: user.version + 1,
      },
    });

    return updatedUser;
  }

  async updateToken(id: string, refreshToken: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...user,
        refreshToken
      },
    });

    return updatedUser;
  }

  async delete(id: string) {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
