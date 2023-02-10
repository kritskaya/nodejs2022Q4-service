// import { User } from '../interfaces/user.interface';
import { User } from 'prisma/prisma-client';

// export type UserResponse = Omit<User, 'password'>;

export interface UserResponse {
  id: string; // uuid v4
  login: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}
