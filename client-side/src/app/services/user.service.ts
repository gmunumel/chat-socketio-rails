import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from '../models/user';

@Injectable()
export class UserService {
  usersUrl = 'http://localhost:3000/users';  // URL to web api
  headers = new Headers({'Content-Type': 'application/json'});

  constructor(public http: Http) { }

  create(user: User): Promise<User> {
    let body = JSON.stringify({name: user.name, email: user.email});
    let options = new RequestOptions({ headers: this.headers });

    return this.http.post(this.usersUrl, body, options)
                    .toPromise()
                    .then(res => res.json() as User)
                    .catch(this.handleError);
  }

  getUsers(): Promise<User[]> {
    return this.http.get(this.usersUrl)
                    .toPromise()
                    .then(res => res.json() as User[])
                    .catch(this.handleError);
  }

  search(user: User): Promise<User> {
    const url = `${this.usersUrl}/search?name=${user.name}&email=${user.email}`;
    return this.http.get(url)
                    .toPromise()
                    .then(res => res.json() as User)
                    .catch(this.handleError);
  }

  handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
