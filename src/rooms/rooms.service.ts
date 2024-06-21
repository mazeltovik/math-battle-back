import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from 'src/db/db';
import { Room } from 'src/db/modelTypes';

@Injectable()
export class RoomsService {
  constructor() {}
  createRoom(
    body: Omit<Room, 'host' | 'users'> & { userId: string },
    roomId: any,
  ) {
    const { isExist, err, user } = this.isExistUser(body.userId);
    if (isExist) {
      const { isCreate, err } = this.didUserCreateRoom(body.userId);
      if (!isCreate) {
        db.rooms.push({
          roomId,
          name: body.name,
          time: body.time,
          difficulty: body.difficulty,
          isAllowedChat: body.isAllowedChat,
          connectedUsers: body.connectedUsers,
          host: user,
          users: [user],
          awaiters: [],
        });
      } else {
        throw new Error(err);
      }
    } else {
      throw new Error(err);
    }
  }
  isExistUser(userId: string) {
    const user = db.users.find((user) => user.userId == userId);
    return user
      ? { isExist: true, user }
      : { isExist: false, err: "User doesn't exist" };
  }
  didUserCreateRoom(userId: string) {
    const didHostCreateRoom = db.rooms.find(
      (room) => room.host.userId == userId,
    );
    return didHostCreateRoom
      ? { isCreate: true, err: 'User created room' }
      : { isCreate: false };
  }

  getRooms(userId: string) {
    return db.rooms.filter((room) => room.host.userId != userId);
  }
  getRoomByUserId(id: string) {
    const room = db.rooms.find((room) => room.host.userId == id);
    if (room) {
      const { roomId, name, difficulty, time, isAllowedChat, connectedUsers } =
        room;
      return {
        roomId,
        name,
        difficulty,
        time,
        isAllowedChat,
        connectedUsers,
      };
    } else throw new Error('You havent create any room yet.');
  }
  getRoomByRoomId(roomId: string) {
    const room = db.rooms.find((room) => room.roomId == roomId);
    return room
      ? { isExistRoom: true, room }
      : { isExistRoom: false, err: "Room doesn't exist" };
  }
  checkAwaiterInRoom(userId: string, room: Room) {
    const isAwaiterInRoom = room.awaiters.find(
      (awaiter) => (awaiter.userId = userId),
    );
    return isAwaiterInRoom ? true : false;
  }
  setAwaiter(userId, roomId) {
    const { isExist, err, user: awaiter } = this.isExistUser(userId);
    if (isExist) {
      const { isExistRoom, err, room } = this.getRoomByRoomId(roomId);
      if (isExistRoom) {
        room.awaiters.push(awaiter);
        return {
          owner: room.host.socketId,
          amoutOfAwaiters: room.awaiters.length,
        };
      } else {
        throw new Error(err);
      }
    } else {
      throw new Error(err);
    }
  }
  removeAwaiter(userId: string, targetRoom: string) {
    const roomOwner = db.rooms.find((room) => room.roomId == targetRoom);
    if (roomOwner) {
      roomOwner.awaiters = roomOwner.awaiters.filter(
        (awaiter) => awaiter.userId !== userId,
      );
    }
    return {
      owner: roomOwner.host.socketId,
      amountOfAwaiter: roomOwner.awaiters.length,
    };
  }
  getAwaiters(userId: string) {
    const roomOwner = db.rooms.find((room) => room.host.socketId == userId);
    if (roomOwner) {
      return roomOwner.awaiters.map((user) => {
        const { userId, name } = user;
        return { userId, name };
      });
    } else return [];
  }
}
