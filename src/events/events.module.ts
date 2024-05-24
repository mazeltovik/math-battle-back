import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { UserService } from 'src/user/user.service';
import { RoomsService } from 'src/rooms/rooms.service';

@Module({
  providers: [EventsGateway, UserService, RoomsService],
})
export class EventsModule {}
