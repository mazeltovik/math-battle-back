import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { UserModule } from './user/user.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [UserModule, EventsModule, RoomsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
