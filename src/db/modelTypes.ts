export type User = {
  userId: string;
  name: string;
  socketId: string;
  login: string;
  password: string;
};

export type Room = {
  roomId: string;
  name: string;
  time: string;
  difficulty: number;
  isAllowedChat: boolean;
  connectedUsers: number;
  host: User;
  foe: Record<PropertyKey, string>;
  users: User[];
  awaiters: User[];
};
