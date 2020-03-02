import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { UserType } from '../model/UserType';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockBackendService {

  // Array representing users stored on backend.
  private _users: User[] = [
    {
      name: 'User1',
      email: 'user1@email.com',
      type: UserType.User
    },
    {
      name: 'User2',
      email: 'user2@email.com',
      type: UserType.User
    },
    {
      name: 'User3',
      email: 'user3@email.com',
      type: UserType.Admin
    },
    {
      name: 'User3',
      email: 'user3@email.com',
      type: UserType.ReadOnly
    },
  ];

  constructor() { }

  // Method that simulates a get request to the backend
  public get(): Observable<User[]> {
    return from([this._users]);
  }

  // Method that simulates a post request to the backend
  public post(user: User) {
    this._users.push(user);
    // If the post success, the backend would send an identifier of the posted user
    return from([user.email]);
  }

  // Method that simulates a delete request to the backend
  public delete(user: User): Observable<string> {
    const userIndex = this._users.findIndex(u => u === user);
    this._users.splice(userIndex, 1);
    // If the delete success, the backend would send an identifier of the deleted user
    return from([user.email]);
  }
}
