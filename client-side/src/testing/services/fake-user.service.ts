import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

// re-export for tester convenience
export { User }        from '../../app/models/user';
export { UserService } from '../../app/services/user.service';

import { User }        from '../../app/models/user';
import { UserService } from '../../app/services/user.service';

export var USERS: User[] = [
  new User(0, 'Bob', 'bob@example.com'),
  new User(1, 'Carol', 'carol@example.com'),
  new User(2, 'Ted', 'ted@example.com'),
  new User(3, 'Alice', 'alice@example.com'),
  new User(4, 'Speedy', 'speedy@example.com'),
  new User(5, 'Stealthy', 'stealthy@example.com')
];

// Dummy UserService. Pretend it makes real http requests 
@Injectable()
export class FakeUserService implements UserService {

  usersUrl = 'http://localhost:3000/users';  // URL to web api
  headers = new Headers({'Content-Type': 'application/json'});
  lastPromise: Promise<any>;  // remember so we can spy on promise calls

  users = USERS.map(u => u.clone());

  constructor(public http: Http) { }

  getUser(id: number): Promise<User> {
    let userFound = this.users.find(u => u.id === id);
    return this.lastPromise = Promise.resolve<User>(userFound);
  }

  getUsers(): Promise<User[]> {
    return this.lastPromise = Promise.resolve<User[]>(this.users);
  }

  search(user: User): Promise<User> {
    let userFound = this.users.find(u => u.name === user.name && u.email === user.email);
    return this.lastPromise = Promise.resolve(userFound);
  }

  create(user: User): Promise<User> {
    this.users.push(user);
    return this.lastPromise = Promise.resolve(user);
  }

  update(user: User): Promise<User> {
    return this.lastPromise = this.getUser(user.id).then(u => {
      return u ?
        Object.assign(u, user) :
        Promise.reject(`User ${user.id} not found`) as any as Promise<User>;
    });
  }

  delete(id: number): Promise<void> {
    return this.lastPromise = this.getUser(id).then(u => {
      if (u) {
        this.users.splice(u.id, 1);
        return Promise.resolve<void>(null);
      } else {
        return Promise.reject(`User ${id} not found`) as any as Promise<void>;
      }
    });
  }

  handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
