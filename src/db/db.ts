import { Room, User } from './modelTypes';

class DB {
  users: User[];
  rooms: Room[];
  constructor() {
    this.users = [];
    this.rooms = [];
  }
}

export const db = new DB();
