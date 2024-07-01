import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from 'src/db/db';
import { Room } from 'src/db/modelTypes';
import { ReceiveRoomData } from 'src/events/eventsDTO';

@Injectable()
export class RoomsService {
  constructor() {}
  createRoom(body: ReceiveRoomData, roomId: string) {
    const { isExist, err, user } = this.isExistUser(body.userId);
    if (isExist) {
      const { isCreate, err } = this.didUserCreateRoom(body.userId);
      if (!isCreate) {
        const { name, connectedUsers, difficulty, isAllowedChat, time } = body;
        const room = {
          roomId,
          name,
          connectedUsers,
          difficulty,
          isAllowedChat,
          time,
        };
        db.rooms.push(
          Object.assign({}, room, {
            host: user,
            foe: {},
            awaiters: [],
            users: [user],
          }),
        );
        return room;
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
    return db.rooms
      .filter((room) => room.host.userId != userId)
      .map((room) => {
        const {
          roomId,
          name,
          difficulty,
          time,
          isAllowedChat,
          connectedUsers,
        } = room;
        const existRoom = {
          roomId,
          name,
          difficulty,
          time,
          isAllowedChat,
          connectedUsers,
        };
        return existRoom;
      });
  }
  getRoomByUserId(userId: string) {
    const room = db.rooms.find((room) => room.host.userId == userId);
    return room ? room : undefined;
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
          amountOfAwaiters: room.awaiters.length,
          ownerId: room.host.userId,
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
      amountOfAwaiters: roomOwner.awaiters.length,
      ownerId: roomOwner.host.userId,
    };
  }
  getAwaiters(userId: string) {
    const roomOwner = db.rooms.find((room) => room.host.userId == userId);
    if (roomOwner) {
      return roomOwner.awaiters.map((user) => {
        const { userId, name } = user;
        return { userId, name };
      });
    } else return [];
  }
  setFoe(host: string, foe: string) {
    const room = db.rooms.find((room) => room.host.userId == host);
    if (room) {
      const foeUser = db.users.find((user) => user.userId == foe);
      if (foeUser) {
        room.foe = foeUser;
        room.users.push(foeUser);
        return { foeSocket: foeUser.socketId, roomId: room.roomId };
      }
    }
  }
  removeAwaiterFromHost(host: string, foe: string) {
    const roomOwner = db.rooms.find((room) => room.host.userId == host);
    if (roomOwner) {
      roomOwner.awaiters = roomOwner.awaiters.filter(
        (awaiter) => awaiter.userId !== foe,
      );
    }
    return {
      amountOfAwaiters: roomOwner.awaiters.length,
    };
  }
  updateConnectedUsers(host: string, updateUsers: number) {
    const roomOwner = db.rooms.find((room) => room.host.userId == host);
    if (roomOwner) {
      roomOwner.connectedUsers = updateUsers;
    }
    const { roomId, connectedUsers } = roomOwner;
    return { roomId, connectedUsers };
  }
}
