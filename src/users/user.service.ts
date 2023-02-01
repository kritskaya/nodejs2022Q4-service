import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      login: 'testUser',
      password: 'password',
      version: 1,
      createdAt: 1674784901,
      updatedAt: 1674784901,
    },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    return this.users.find((user) => user.id === id);
  }

  create(userDTO: CreateUserDTO): User {
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

    this.users.push(newUser);

    return newUser;
  }

  update(id: string, passwordDTO: UpdatePasswordDTO): User {
    const user = this.users.find((item) => item.id === id);

    const updatedUser: User = {
      ...user,
      password: passwordDTO.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };

    const userIndex = this.users.findIndex((item) => item.id === id);
    this.users[userIndex] = updatedUser;

    return updatedUser;
  }

  delete(id: string) {
    const userIndex = this.users.findIndex((item) => item.id === id);
    this.users.splice(userIndex, 1);
  }
}
