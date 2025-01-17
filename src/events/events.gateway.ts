import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { from, Observable } from 'rxjs';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  async connect(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log(client.rooms);
    this.server.emit('message', 'a user connected');
  }
  @SubscribeMessage('showRooms')
    handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket): WsResponse<unknown>  {
      const event = 'showRooms';
      console.dir(this.server.eventNames());
      return { event, data:client.rooms };
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
