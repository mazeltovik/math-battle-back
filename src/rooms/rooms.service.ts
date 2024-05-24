import { Injectable } from '@nestjs/common';
import { db } from 'src/db/db';
import { Room } from 'src/db/modelTypes';

@Injectable()
export class RoomsService {
  constructor() {}
  async createRoom(
    body: Omit<Room, 'host' | 'users'> & { userId: string },
    roomId: any,
  ) {
    const user = db.users.find((user) => user.userId == body.userId);
    const didHostCreateRoom = db.rooms.find(
      (room) => room.host.userId == body.userId,
    );
    if (user && !didHostCreateRoom) {
      db.rooms.push({
        roomId,
        name: body.name,
        time: body.time,
        difficulty: body.difficulty,
        isAllowedChat: body.isAllowedChat,
        host: user,
        users: [user],
      });
      return true;
    }
    return false;
  }
  getRooms() {
    return db.rooms;
  }
}
