import { Controller, Get } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('api')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}
  @Get('rooms')
  getRooms() {
    try {
      return this.roomsService.getRooms();
    } catch (err) {
      throw err;
    }
  }
}
