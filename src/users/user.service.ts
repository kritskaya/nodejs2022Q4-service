import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateUserDTO } from './dto/user.dto';
import { UpdatePasswordDTO } from './dto/password.dto';
import { User } from './interfaces/user.interface';
import { DBService } from 'src/db/db.service';

@Injectable()
export class UserService {
  constructor(private dbService: DBService) {}

  async findAll(): Promise<User[]> {
    return await this.dbService.getAllUsers();
  }

  async findOne(id: string): Promise<User> {
    return this.dbService.getUser(id);
  }

  async create(userDTO: CreateUserDTO): Promise<User> {
    const id = uuid();
    const version = 1;
    const createdAt = Date.now();

    const newUser = {
      id,
      login: userDTO.login,
      password: userDTO.password,
      version,
      createdAt,
      updatedAt: createdAt,
    };

    await this.dbService.createUser(newUser);

    return newUser;
  }

  async update(id: string, passwordDTO: UpdatePasswordDTO): Promise<User> {
    const user = await this.dbService.getUser(id);

    const updatedUser: User = {
      ...user,
      password: passwordDTO.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };

    await this.dbService.updateUser(id, updatedUser);

    return updatedUser;
  }

  async delete(id: string) {
    await this.dbService.deleteUser(id);
  }
}
