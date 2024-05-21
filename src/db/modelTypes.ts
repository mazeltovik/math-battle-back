export type User = {
  userId: string;
  name: string;
  socketId: string;
  login: string;
  password: string;
};

export type Room = {
  name: string;
  host: User;
  users: User[];
};
