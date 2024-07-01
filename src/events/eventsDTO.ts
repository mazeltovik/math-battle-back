export type ReceiveRoomData = {
  userId: string;
  name: string;
  difficulty: number;
  isAllowedChat: boolean;
  time: string;
  connectedUsers: number;
};

export type EmitCreateRoom = {
  roomId: string;
  name: string;
  difficulty: number;
  isAllowedChat: boolean;
  time: string;
  connectedUsers: number;
};

export type Err = {
  err: string;
  warning: string;
};

export type Awaiter = {
  userId: string;
  name: string;
};

export type RecieveApprovedConnection = {
  host: string;
  foe: string;
};

export type RecieveUpdateConnectedUsers = {
  host: string;
  updateUsers: number;
};

export type EmitApprovedConnection = {
  status: boolean;
  roomId: string;
};

export type EmitUpdateConnectedUsers = {
  roomId: string;
  connectedUsers: number;
};

export interface ServerToClientEvents {
  CREATE_ROOM: (data: EmitCreateRoom[] & Err) => void;
  GET_ROOM_BY_USER_ID: (data: EmitCreateRoom[] & Err) => void;
  GET_ROOMS: (data: EmitCreateRoom[]) => void;
  ADD_CREATED_ROOM: (data: EmitCreateRoom) => void;
  REQUEST_FOR_CONNECTING: (data: { amountOfAwaiters: number }) => void;
  LEAVE_AWAITING_ROOM: (data: { amountOfAwaiters: number }) => void;
  GET_AWAITERS: (data: Awaiter[]) => void;
  APPROVE_CONNECTION: (data: EmitApprovedConnection) => void;
  REMOVE_AWAITER: (data: { amountOfAwaiters: number }) => void;
  UPDATE_CONNECTED_USERS: (data: EmitUpdateConnectedUsers) => void;
}

export interface ClientToServerEvents {
  CREATE_ROOM: (data: ReceiveRoomData) => void;
  GET_ROOM_BY_USER_ID: ({ userId }: { userId: string }) => void;
  GET_ROOMS: ({ userId }: { userId: string }) => void;
  REQUEST_FOR_CONNECTING: ({
    userId,
    roomId,
  }: {
    userId: string;
    roomId: string;
  }) => void;
  LEAVE_AWAITING_ROOM: (data: { userId: string; targetRoom: string }) => void;
  GET_AWAITERS: ({ userId }: { userId: string }) => void;
  APPROVE_CONNECTION: (data: RecieveApprovedConnection) => void;
  REMOVE_AWAITER: (data: RecieveApprovedConnection) => void;
  UPDATE_CONNECTED_USERS: (data: RecieveUpdateConnectedUsers) => void;
}
