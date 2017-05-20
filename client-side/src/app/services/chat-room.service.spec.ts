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

import { ChatRoom }        from '../models/chat-room';
import { ChatRoomService } from './chat-room.service';

const makeChatRoomData = () => [
  { id: 0, title: 'Sports', created_id: 1, sender_id: 1, recipient_id: 1 },
  { id: 1, title: 'News', created_id: 1, sender_id: 1, recipient_id: 1 },
  { id: 2, title: 'Random', created_id: 1, sender_id: 1, recipient_id: 1 },
  { id: 3, title: 'Politics', created_id: 1, sender_id: 1, recipient_id: 1 },
] as ChatRoom[];

describe('ChatRoomService (mockBackend)', () => {

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        ChatRoomService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    })
    .compileComponents();
  }));

  it('can instantiate service when inject service',
    inject([ChatRoomService], (service: ChatRoomService) => {
      expect(service instanceof ChatRoomService).toBe(true);
  }));

  it('can instantiate service with "new"', inject([Http], (http: Http) => {
    expect(http).not.toBeNull('http should be provided');
    let service = new ChatRoomService(http);
    expect(service instanceof ChatRoomService).toBe(true, 'new service should be ok');
  }));

  it('can provide the mockBackend as XHRBackend',
    inject([XHRBackend], (backend: MockBackend) => {
      expect(backend).not.toBeNull('backend should be provided');
  }));

  describe('when create chat room', () => {
      let backend: MockBackend;
      let service: ChatRoomService;
      let chatRoom: ChatRoom;
      let response: Response;

      beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
        backend = be;
        service = new ChatRoomService(http);
        chatRoom = new ChatRoom(0, 'test', 1, 1, 1);
        let options = new ResponseOptions({status: 200, body: {chatRoom: chatRoom}});
        response = new Response(options);
      }));

      it('should have expected fake chat rooms (then)', async(inject([], () => {
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

        service.create(chatRoom)
          .then((res: any) => {
            expect(res.chatRoom.title).toBe(chatRoom.title,
              'should have expected title');
          });
      })));

      it('should be OK returning no chat room', async(inject([], () => {
        let resp = new Response(new ResponseOptions({status: 200, body: {chatRoom: []}}));
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

        service.create(chatRoom)
          .then((res: any) => {
            expect(res.chatRoom.length).toBe(0, 'should have no chat room');
          });
      })));

      it('should treat 404 as a Promise error', async(inject([], () => {
        let resp = new Response(new ResponseOptions({status: 404}));
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

        service.create(chatRoom)
          .then()
          .catch(err => {
            expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
            return Promise.reject(err.message || err); // failure is the expected test result
          });
      })));
  });

  describe('when get all chat rooms', () => {
      let backend: MockBackend;
      let service: ChatRoomService;
      let fakeChatRooms: ChatRoom[];
      let response: Response;

      beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
        backend = be;
        service = new ChatRoomService(http);
        fakeChatRooms = makeChatRoomData();
        let options = new ResponseOptions({status: 200, body: {chatRooms: fakeChatRooms}});
        response = new Response(options);
      }));

      it('should have expected fake chat rooms (then)', async(inject([], () => {
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

        service.getChatRooms()
          .then((res: any) => {
            expect(res.chatRooms.length).toBe(fakeChatRooms.length,
              'should have expected no. of chat rooms');
          });
      })));

      it('should be OK returning no chat room', async(inject([], () => {
        let resp = new Response(new ResponseOptions({status: 200, body: {chatRooms: []}}));
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

        service.getChatRooms()
          .then((res: any) => {
            expect(res.chatRooms.length).toBe(0, 'should have no chat room');
          });
      })));

      it('should treat 404 as a Promise error', async(inject([], () => {
        let resp = new Response(new ResponseOptions({status: 404}));
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

        service.getChatRooms()
          .then()
          .catch(err => {
            expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
            return Promise.reject(err.message || err); // failure is the expected test result
          });
      })));
  });
});
