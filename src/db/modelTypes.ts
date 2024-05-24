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
  host: User;
  users: User[];
};
