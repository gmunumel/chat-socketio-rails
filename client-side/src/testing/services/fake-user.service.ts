import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

// re-export for tester convenience
export { User }        from '../../app/models/user';
export { UserService } from '../../app/services/user.service';

import { User }        from '../../app/models/user';
import { UserService } from '../../app/services/user.service';

const USERS: User[] = [
  new User('Bob', 'bob@example.com'),
  new User('Carol', 'carol@example.com'),
  new User('Ted', 'ted@example.com'),
  new User('Alice', 'alice@example.com'),
  new User('Speedy', 'speedy@example.com'),
  new User('Stealthy', 'stealthy@example.com')
];

// Dummy UserService. Pretend it makes real http requests 
@Injectable()
export class FakeUserService implements UserService {

  usersUrl = 'http://localhost:3000/users';  // URL to web api
  headers = new Headers({'Content-Type': 'application/json'});
  lastPromise: Promise<any>;  // remember so we can spy on promise calls

  users = USERS.map(u => u.clone());

  constructor(public http: Http) { }

  create(user: User): Promise<User> {
    this.users.push(user);
    return this.lastPromise = Promise.resolve(user);
  }

  search(user: User): Promise<User> {
    let userFound = this.users.find(u => u.name === user.name && u.email === user.email);
    return this.lastPromise = Promise.resolve(userFound);
  }

  handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
