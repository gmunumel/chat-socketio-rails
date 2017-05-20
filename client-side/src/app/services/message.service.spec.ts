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

import { Message }        from '../models/message';
import { MessageService } from './message.service';

const makeMessageData = () => [
  { id: 0, body: 'Long Message', user_id: 1, chat_room_id: 1 },
  { id: 1, body: 'First Message', user_id: 1, chat_room_id: 1 },
  { id: 2, body: 'Second Message', user_id: 1, chat_room_id: 1 },
  { id: 3, body: 'Third Message', user_id: 1, chat_room_id: 1 },
] as Message[];

describe('MessageService (mockBackend)', () => {

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        MessageService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    })
    .compileComponents();
  }));

  it('can instantiate service when inject service',
    inject([MessageService], (service: MessageService) => {
      expect(service instanceof MessageService).toBe(true);
  }));

  it('can instantiate service with "new"', inject([Http], (http: Http) => {
    expect(http).not.toBeNull('http should be provided');
    let service = new MessageService(http);
    expect(service instanceof MessageService).toBe(true, 'new service should be ok');
  }));

  it('can provide the mockBackend as XHRBackend',
    inject([XHRBackend], (backend: MockBackend) => {
      expect(backend).not.toBeNull('backend should be provided');
  }));

  describe('when create message', () => {
      let backend: MockBackend;
      let service: MessageService;
      let message: Message;
      let response: Response;

      beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
        backend = be;
        service = new MessageService(http);
        message = new Message(0, 'test', 1, 1);
        let options = new ResponseOptions({status: 200, body: {message: message}});
        response = new Response(options);
      }));

      it('should have expected fake messages (then)', async(inject([], () => {
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

        service.create(message)
          .then((res: any) => {
            expect(res.message.body).toBe(message.body,
              'should have expected body');
          });
      })));

      it('should be OK returning no message', async(inject([], () => {
        let resp = new Response(new ResponseOptions({status: 200, body: {message: []}}));
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

        service.create(message)
          .then((res: any) => {
            expect(res.message.length).toBe(0, 'should have no message');
          });
      })));

      it('should treat 404 as a Promise error', async(inject([], () => {
        let resp = new Response(new ResponseOptions({status: 404}));
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

        service.create(message)
          .then()
          .catch(err => {
            expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
            return Promise.reject(err.message || err); // failure is the expected test result
          });
      })));
  });

  describe('when get all message', () => {
      let backend: MockBackend;
      let service: MessageService;
      let fakeMessages: Message[];
      let response: Response;

      beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
        backend = be;
        service = new MessageService(http);
        fakeMessages = makeMessageData();
        let options = new ResponseOptions({status: 200, body: {messages: fakeMessages}});
        response = new Response(options);
      }));

      it('should have expected fake messages (then)', async(inject([], () => {
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

        service.getMessages()
          .then((res: any) => {
            expect(res.messages.length).toBe(fakeMessages.length,
              'should have expected no. of messages');
          });
      })));

      it('should be OK returning no message', async(inject([], () => {
        let resp = new Response(new ResponseOptions({status: 200, body: {messages: []}}));
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

        service.getMessages()
          .then((res: any) => {
            expect(res.messages.length).toBe(0, 'should have no message');
          });
      })));

      it('should treat 404 as a Promise error', async(inject([], () => {
        let resp = new Response(new ResponseOptions({status: 404}));
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

        service.getMessages()
          .then()
          .catch(err => {
            expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
            return Promise.reject(err.message || err); // failure is the expected test result
          });
      })));
  });
});
