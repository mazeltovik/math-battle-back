import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
// import * as bcrypt from 'bcryptjs';

type Body = {
  name: string;
  login: string;
  password: string;
  socketId: string;
};

type User = {
  userId: string;
  name: string;
  socketId: string;
  login: string;
  password: string;
};

@Injectable()
export class UserService {
  users: User[] = [];
  constructor() {}
  async auth(body: Body) {
    const userId = uuidv4();
    const newUser = Object.assign(body, { userId });
    this.users.push(newUser);
    return newUser;
  }
}