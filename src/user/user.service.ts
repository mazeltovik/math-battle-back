import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
// import * as bcrypt from 'bcryptjs';
import { db } from 'src/db/db';
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

type Room = {
  name: string;
  host: User;
  users: User[];
};

@Injectable()
export class UserService {
  constructor() {}
  async auth(body: Body) {
    const userId = uuidv4();
    const newUser = Object.assign(body, { userId });
    db.users.push(newUser);
    console.log(db.users);
    return newUser;
  }
}
