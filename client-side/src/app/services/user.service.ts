import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from '../models/user';

@Injectable()
export class UserService {
  usersUrl = 'http://localhost:3000/users';  // URL to web api
  headers = new Headers({'Content-Type': 'application/json'});

  constructor(public http: Http) { }

  create(user: User): Promise<User> {
    return this.http
      .post(this.usersUrl,
        JSON.stringify({name: user.name, email: user.email}),
        {headers: this.headers}
      )
      .toPromise()
      .then(res => res.json() as User)
      .catch(this.handleError);
  }

  search(user: User): Promise<User> {
    const url = `${this.usersUrl}/search?name=${user.name}&email=${user.email}`;
    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json() as User)
      .catch(this.handleError);
  }

  handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
