import {
   async, inject, TestBed
} from '@angular/core/testing';

import {
  MockBackend,
  MockConnection
} from '@angular/http/testing';

import {
  HttpModule, Http, XHRBackend, Response, ResponseOptions
} from '@angular/http';

import { User } from '../models/user';
import { UserService } from './user.service';

describe('UserService (mockBackend)', () => {

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        UserService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    })
    .compileComponents();
  }));

  it('can instantiate service when inject service',
    inject([UserService], (service: UserService) => {
      expect(service instanceof UserService).toBe(true);
  }));

  it('can instantiate service with "new"', inject([Http], (http: Http) => {
    expect(http).not.toBeNull('http should be provided');
    let service = new UserService(http);
    expect(service instanceof UserService).toBe(true, 'new service should be ok');
  }));


  it('can provide the mockBackend as XHRBackend',
    inject([XHRBackend], (backend: MockBackend) => {
      expect(backend).not.toBeNull('backend should be provided');
  }));

  describe('when create user', () => {
      let backend: MockBackend;
      let service: UserService;
      let user: User;
      let response: Response;

      beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
        backend = be;
        service = new UserService(http)
        user = new User('test', 'test@example.com');
        let options = new ResponseOptions({status: 200, body: {user: user}});
        response = new Response(options);
      }));

      it('should have expected fake users (then)', async(inject([], () => {
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

        service.create(user)
          .then((res: any) => {
            expect(res.user.name).toBe(user.name,
              'should have expected name');
            expect(res.user.email).toBe(user.email,
              'should have expected email');
          });
      })));

      it('should be OK returning no user', async(inject([], () => {
        let resp = new Response(new ResponseOptions({status: 200, body: {user: []}}));
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

        service.create(user)
          .then((res: any) => {
            expect(res.user.length).toBe(0, 'should have no user');
          });
      })));

      it('should treat 404 as an Promise error', async(inject([], () => {
        let resp = new Response(new ResponseOptions({status: 404}));
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

        service.create(user)
          .then()
          .catch(err => {
            expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
            return Promise.reject(err.message || err); // failure is the expected test result
          });
      })));
  });
});
