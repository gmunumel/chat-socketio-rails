import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable }    from 'rxjs/Observable';

// Observable class extensions
import 'rxjs/add/observable/of';

// re-export for tester convenience
export { User }               from '../../app/models/user';
export { UserService }        from '../../app/services/user.service';
export { EnvironmentService } from '../../app/services/environment.service';

import { User }               from '../../app/models/user';
import { UserService }        from '../../app/services/user.service';
import { EnvironmentService } from '../../app/services/environment.service';

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
  usersUrl = `${EnvironmentService.getInstance().getApiUrl()}/users`;  // URL to web api
  headers = new Headers({'Content-Type': 'application/json'});
  lastPromise: Promise<any>;  // remember so we can spy on promise calls
  lastObservable: Observable<any>;

  users = USERS.map(u => u.clone());

  constructor(public http: Http) { }

  getUser(id: number): Promise<User> {
    let userFound = this.users.find(u => u.id === id);
    return this.lastPromise = Promise.resolve(userFound);
  }

  getUsers(ids?: number[]): Promise<User[]> {
    if (ids) {
      let filteredUsers = this.users.filter((u: User) => ids.indexOf(u.id) >= 0);
      return this.lastPromise = Promise.resolve(filteredUsers);
    }
    return this.lastPromise = Promise.resolve(this.users);
  }

  search(name: string, email?: string): Observable<User[]> {
    let userFound = null;
    if (email) {
      userFound = this.users.find(u => u.name === name && u.email === email);
    } else {
      userFound = (name === '') ? this.users : this.users.find(u => u.name === name);
    }
    this.lastObservable = (userFound) ? Observable.of(userFound as User[]) : Observable.of(null);
    return this.lastObservable;
  }

  fetch(user: User): Promise<User> {
    let userFound = this.users.find(u => u.name === user.name && u.email === user.email);
    return this.lastPromise = Promise.resolve(userFound);
  }

  create(user: User): Promise<User> {
    return this.search(user.name, user.email).toPromise().then(u => {
      if (u) {
        return Promise.reject({ status: 409 }) as any as Promise<User>;
      } else {
        this.users.push(user);
        return this.lastPromise = Promise.resolve(user);
      }
    });
  }

  update(user: User): Promise<User> {
    return this.lastPromise = this.getUser(user.id).then(u => {
      return u ?
        Object.assign(u, user) :
        Promise.reject(`User ${user.id} not found`) as any as Promise<User>;
    });
  }

  delete(user: User): Promise<void> {
    return this.lastPromise = this.getUser(user.id).then(u => {
      return u ?
        Promise.resolve<void>(null) :
        Promise.reject(`User ${user.id} not found`) as any as Promise<void>;
    });
  }

  handlePromiseError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  handleObservableError(error: any): Observable<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Observable.throw(error.message || error);
  }
}
