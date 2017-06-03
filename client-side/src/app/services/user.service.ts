import { Injectable }                    from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { Observable }  from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { User } from '../models/user';

import { EnvironmentService } from './environment.service';

@Injectable()
export class UserService {
  usersUrl = `${EnvironmentService.getInstance().getApiUrl()}/users`;  // URL to web api
  headers = new Headers({'Content-Type': 'application/json'});

  constructor(public http: Http) { }

  getUser(id: number): Promise<User> {
    let url = `${this.usersUrl}/${id}`;

    return this.http.get(url)
                    .toPromise()
                    .then(response => response.json() as User)
                    .catch(this.handlePromiseError);
  }

  getUsers(ids?: number[]): Promise<User[]> {
    if (ids) {
      let stringIds = ids.map(String).join();
      this.usersUrl = `${this.usersUrl}?ids=${stringIds}`;
    }

    return this.http.get(this.usersUrl)
                    .toPromise()
                    .then(res => res.json() as User[])
                    .catch(this.handlePromiseError);
  }

  search(name: string, email?: string): Observable<User[]> {
    let url = `${this.usersUrl}/search?name=${name}`;
    if (email) {
      url = `${url}&email=${email}`;
    }

    return this.http.get(url)
                    .map(res => res.json() as User[] || {})
                    .catch(this.handleObservableError);
  }

  fetch(user: User): Promise<User> {
    let url = `${this.usersUrl}/fetch?name=${user.name}&email=${user.email}`;

    return this.http.get(url)
                    .toPromise()
                    .then(res => res.json() as User)
                    .catch(this.handlePromiseError);
  }

  create(user: User): Promise<User> {
    let body = JSON.stringify({name: user.name, email: user.email});
    let options = new RequestOptions({ headers: this.headers });

    return this.http.post(this.usersUrl, body, options)
                    .toPromise()
                    .then(res => res.json() as User)
                    .catch(this.handlePromiseError);
  }

  update(user: User): Promise<User> {
    let url = `${this.usersUrl}/${user.id}`;
    let body = JSON.stringify({name: user.name, email: user.email});
    let options = new RequestOptions({ headers: this.headers });

    return this.http.put(url, body, options)
                    .toPromise()
                    .then(() => user)
                    .catch(this.handlePromiseError);
  }

  delete(user: User): Promise<void> {
    let url = `${this.usersUrl}/${user.id}`;
    let options = new RequestOptions({ headers: this.headers });

    return this.http.delete(url, options)
                    .toPromise()
                    .then(() => null)
                    .catch(this.handlePromiseError);
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
