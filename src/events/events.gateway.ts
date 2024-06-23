import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { ModuleRef } from '@nestjs/core';
import { Server, Socket } from 'socket.io';
import { from, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from 'src/user/user.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { db } from 'src/db/db';
import { Room } from 'src/db/modelTypes';
import { Body } from '@nestjs/common';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;
  private userService: UserService;
  private roomsService: RoomsService;
  constructor(private moduleRef: ModuleRef) {}
  onModuleInit() {
    this.userService = this.moduleRef.get(UserService);
    this.roomsService = this.moduleRef.get(RoomsService);
  }
  @SubscribeMessage('connect')
  async connect(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('a user connected');
    client.emit('connection', 'a user connected');
  }
  @SubscribeMessage('CREATE_ROOM')
  async createRoom(
    @MessageBody() body: Omit<Room, 'host' | 'users'> & { userId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<unknown>> {
    const event = 'CREATE_ROOM';
    const roomId = uuidv4();
    try {
      this.roomsService.createRoom(body, roomId);
      const room = {
        roomId,
        name: body.name,
        difficulty: body.difficulty,
        isAllowedChat: body.isAllowedChat,
        time: body.time,
        connectedUsers: 1,
      };
      client.join(roomId);
      console.log(this.server.of('/').adapter.rooms);
      this.server.emit('ADD_CREATED_ROOM', room);
      return {
        event,
        data: [room],
      };
    } catch (err) {
      return { event, data: { err: err.message } };
    }
  }
  @SubscribeMessage('GET_ROOM_BY_USER_ID')
  async getRoomByUserId(
    @MessageBody() body: { userId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<unknown>> {
    const { userId } = body;
    const event = 'GET_ROOM_BY_USER_ID';
    // this.server.emit('upgrade', 'Hello');
    try {
      const room = this.roomsService.getRoomByUserId(userId);
      return { event, data: [room] };
    } catch (err) {
      return { event, data: { warning: err.message } };
    }
  }
  @SubscribeMessage('GET_ROOMS')
  async getRooms(@MessageBody() body: { userId: string }) {
    const { userId } = body;
    const event = 'GET_ROOMS';
    const rooms = this.roomsService.getRooms(userId);
    return { event, data: rooms };
    // this.server.emit(event, rooms);
  }

  @SubscribeMessage('REQUEST_FOR_CONNECTING')
  async regForConnecting(
    @MessageBody() body: { userId: string; roomId: string },
  ) {
    const event = 'REQUEST_FOR_CONNECTING';
    const { userId, roomId } = body;
    try {
      const { owner, amoutOfAwaiters } = this.roomsService.setAwaiter(
        userId,
        roomId,
      );
      this.server.to(owner).emit(event, amoutOfAwaiters);
      const awaiters = this.roomsService.getAwaiters(owner);
      this.server.to(owner).emit('GET_AWAITERS', awaiters);
    } catch (err) {
      return { event, data: { warning: err.message } };
    }
  }
  @SubscribeMessage('LEAVE_AWAITING_ROOM')
  async leaveTargetRoom(
    @MessageBody() body: { userId: string; targetRoom: string },
  ) {
    const { userId, targetRoom } = body;
    const event = 'LEAVE_AWAITING_ROOM';
    const { owner, amountOfAwaiter } = this.roomsService.removeAwaiter(
      userId,
      targetRoom,
    );
    this.server.to(owner).emit(event, amountOfAwaiter);
    const awaiters = this.roomsService.getAwaiters(owner);
    this.server.to(owner).emit('GET_AWAITERS', awaiters);
  }

  @SubscribeMessage('GET_AWAITERS')
  async getAwaiters(@MessageBody() body: { userId: string }) {
    const { userId } = body;
    const event = 'GET_AWAITERS';
    const awaiters = this.roomsService.getAwaiters(userId);
    return { event, data: awaiters };
  }
  @SubscribeMessage('APPROVE_CONNECTION')
  async approveConnection(@MessageBody() body: { host: string; foe: string }) {
    const event = 'APPROVE_CONNECTION';
    const { host, foe } = body;
    const { foeSocket, roomId } = this.roomsService.setFoe(host, foe);
    this.server.to(foeSocket).emit(event, { status: true, roomId });
    return { event, data: { status: true, roomId } };
  }
  // @SubscribeMessage('showRooms')
  // handleEvent(
  //   @MessageBody() data: string,
  //   @ConnectedSocket() client: Socket,
  // ): WsResponse<unknown> {
  //   const event = 'showRooms';
  //   console.log(db.users);
  //   return { event, data };
  // }
  // @SubscribeMessage('showRooms')
  // async showRooms(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
  //   const rooms = this.server.of("/").adapter.rooms;
  //   this.server.of("/").adapter.on("create-room", (room) => {
  //     console.log(`room ${room} was created`);
  //   });
  //   client.emit('showRooms', '');
  // }
  //   @SubscribeMessage('events')
  //   findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //     return from([1, 2, 3]).pipe(
  //       map((item) => ({ event: 'events', data: item })),
  //     );
  //   }

  //   @SubscribeMessage('identity')
  //   async identity(@MessageBody() data: number): Promise<number> {
  //     return data;
  //   }
}
