import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
