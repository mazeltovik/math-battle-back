import { Injectable } from '@nestjs/common';
import { db } from 'src/db/db';
import { Room } from 'src/db/modelTypes';

@Injectable()
export class RoomsService {
  constructor() {}
  createRoom(
    body: Omit<Room, 'host' | 'users'> & { userId: string },
    roomId: any,
  ) {
    const {isExist, err, user} = this.isExistUser(body.userId);
    if(isExist){
        const {isCreate,err} = this.didUserCreateRoom(body.userId);
        if(!isCreate){
          db.rooms.push({
            roomId,
            name: body.name,
            time: body.time,
            difficulty: body.difficulty,
            isAllowedChat: body.isAllowedChat,
            host: user,
            users: [user],
          });
        } else {
          throw new Error(err)
        }
    } else {
      throw new Error(err);
    }
  }
  isExistUser(userId:string){
    const user = db.users.find((user) => user.userId == userId);
    return user? {isExist:true, user} : {isExist:false, err:'User doesn\'t exist'} 
  }
  didUserCreateRoom(userId:string){
    const didHostCreateRoom = db.rooms.find(
      (room) => room.host.userId == userId,
    );
    return didHostCreateRoom? {isCreate:true, err: 'User created room'} : {isCreate:false}
  }

  getRooms() {
    return db.rooms;
  }
}
