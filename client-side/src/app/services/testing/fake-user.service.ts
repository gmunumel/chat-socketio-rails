import { Headers, Http } from '@angular/http';

// re-export for tester convenience
export { User }        from '../../models/user';
export { UserService } from '../user.service';

import { User }        from '../../models/user';
import { UserService } from '../user.service';

export class FakeUserService implements UserService {
  usersUrl = 'http://localhost:3000/users';  // URL to web api
  headers = new Headers({'Content-Type': 'application/json'});
  lastPromise: Promise<any>;  // remember so we can spy on promise calls

  constructor(public http: Http) { }

  create(user: User): Promise<User> {
    return this.lastPromise = Promise.resolve(user);
  }

  handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
