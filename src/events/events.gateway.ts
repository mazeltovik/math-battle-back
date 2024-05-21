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
import { UserService } from 'src/user/user.service';
import { db } from 'src/db/db';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;
  private userService: UserService;
  constructor(private moduleRef: ModuleRef) {}
  onModuleInit() {
    this.userService = this.moduleRef.get(UserService);
  }
  @SubscribeMessage('connect')
  async connect(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('a user connected');
    this.server.emit('connection', 'a user connected');
  }
  @SubscribeMessage('showRooms')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    const event = 'showRooms';
    console.log(db.users);
    return { event, data };
  }
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
