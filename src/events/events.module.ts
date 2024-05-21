import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [EventsGateway, UserService],
})
export class EventsModule {}
