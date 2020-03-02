import { Injectable } from '@angular/core';
import { MockBackendService } from './mock-backend.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _users: BehaviorSubject<User[]> = new BehaviorSubject([]);

  constructor(
    public http: MockBackendService // Simulating the real http service...
  ) {}

  public getUsers() {
    return this._users;
  }

  public httpGetUsers() {
    this.http.get().subscribe(users => {
      if (!users) { return; } // request went wrong...
      this._users.next(users);
    });
  }

  public httpPostUser(user: User) {
    this.http.post(user).subscribe(message => {
      // If correctly deleted, update users.
      if (user.email === message) { this.httpGetUsers(); }
    });
  }

  public httpDeleteUser(user: User) {
    this.http.delete(user).subscribe(message => {
      // If correctly deleted, update users.
      if (user.email === message) { this.httpGetUsers(); }
    });
  }
}
