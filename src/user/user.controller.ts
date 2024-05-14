import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  Query,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';

type Body = {
  name: string;
  login: string;
  password: string;
  socketId: string;
};

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @HttpCode(200)
  @Post('auth')
  auth(@Body() body: Body) {
    try {
      return this.userService.auth(body);
    } catch (err) {
      throw err;
    }
  }
}
