import {
  async, fakeAsync, ComponentFixture, TestBed, tick
}                                 from '@angular/core/testing';

import {
  ActivatedRoute, ActivatedRouteStub, newEvent, Router, RouterStub
}                                 from '../../../../testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By }                     from '@angular/platform-browser';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpModule }             from '@angular/http';

import { MessageComponent }   from './message.component';

import { MessageService }     from '../../../services/message.service';
import { UserService }        from '../../../services/user.service';
import { SocketService }      from '../../../services/socket.service';

import { FakeSocketService }  from '../../../../testing/services/fake-socket.service';
import {
  MESSAGES, FakeMessageService
}                             from '../../../../testing/services/fake-message.service';
import { CHATROOMS }          from '../../../../testing/services/fake-chat-room.service';
import {
  USERS, FakeUserService
}                             from '../../../../testing/services/fake-user.service';

const firstChatRoom = CHATROOMS[0];
const firstUser     = USERS[0];

describe('MessageComponent', function () {
  let activatedRoute: ActivatedRouteStub;
  let comp: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;
  let page: Page;

  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, HttpModule ],
      declarations: [ MessageComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router,         useClass: RouterStub }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .overrideComponent(MessageComponent, {
      set: {
        providers: [
          { provide: MessageService, useClass: FakeMessageService },
          { provide: UserService,    useClass: FakeUserService },
          { provide: SocketService,  useClass: FakeSocketService },
        ]
      }
    })
    .compileComponents();
  }));

  describe('when navigate to existing message', () => {
    beforeEach( async(() => {
      activatedRoute.testParams = { chat_room_id: firstChatRoom.id };
      createComponent();
    }));

    it('should create component', () => expect(comp).toBeDefined() );

    it('should have expected <h1> text', () => {
      expect(page.pageName.textContent).toMatch(/admin message/i,
        '<h1> should say something about "Admin Message"');
    });

    it('should display all messages for chat id 1', fakeAsync(() => {
      const allMessages = MESSAGES;
      comp.showMessage(firstChatRoom.id);
      tick();
      expect(comp.response).toBe(1);
      expect(comp.messages.length).toBe(allMessages.length);
    }));

    it('1st message should match 1st chat room message', fakeAsync(() => {
      const expectedMessage = MESSAGES[0];
      comp.showMessage(firstChatRoom.id);
      tick();
      expect(comp.messages[0].message).toEqual(expectedMessage, 'first message is the same');
      expect(comp.messages[0].user).not.toBe(null, 'first user is not null');
    }));

    it('should navigate to selected message detail on click', fakeAsync(() => {
      const expectedMessage  = MESSAGES[1];
      const expectedChatRoom = CHATROOMS[1];
      const input = page.messagesRows[1];
      input.dispatchEvent(newEvent('click'));
      tick();

      // should have navigated
      expect(page.navSpy.calls.any()).toBe(true, 'navigate called');

      // composed message detail will be URL like 'messages/42'
      // expect link array with the route path and message id
      // first argument to router.navigate is link array
      const navArgs = page.navSpy.calls.first().args[0];
      expect(navArgs[0]).toContain('message', 'nav to message detail URL');
      expect(navArgs[0]).toContain(expectedMessage.id, 'expected message.id');
      expect(navArgs[0]).toContain('chat-room', 'URL should contain chat-room');
      expect(navArgs[0]).toContain(expectedChatRoom.id, 'expected chatRoom.id');
    }));

    it('should do nothing in save whithout message body', fakeAsync(() => {
      comp.response = 0;
      comp.messageForm.value.body = '';
      comp.save();
      tick();

      expect(comp.response).toBe(0, 'comp.response is initial value 0');
    }));

    it('should save message', fakeAsync(() => {
      const messages = MESSAGES;
      comp.response = 0;
      comp.messageForm.value.body = 'test message';
      comp.user = firstUser;
      comp.save();
      tick();

      expect(comp.response).toBe(1, 'comp.response is 1');
      expect(comp.messages.length).toBe(messages.length + 1, 'messages should increase in 1');
    }));
  });

  describe('when navigate to non-existant chat room id', () => {
    beforeEach( async(() => {
      activatedRoute.testParams = { chat_room_id: 99999 };
      createComponent();
    }));

    it('should display an error message', fakeAsync(() => {
      tick();
      expect(comp.response).toBe(-1, 'comp.response is -1');
    }));
  });

  /////////// Helpers /////
  // Create the component and set the `page` test variables 
  function createComponent() {
    fixture = TestBed.createComponent(MessageComponent);
    comp = fixture.componentInstance;

    // change detection triggers ngOnInit which gets a message
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      // got the messages and updated component
      // change detection updates the view
      fixture.detectChanges();
      page = new Page();
    });
  }

  class Page {
    // Messages line elements 
    messagesRows:  HTMLLIElement[];

    pageName:      HTMLInputElement;
    addMessageBtn: HTMLInputElement;

    // Spy on router navigate method 
    navSpy:        jasmine.Spy;

    constructor() {
      this.messagesRows = fixture.debugElement.queryAll(By.css('.messages')).map(de => de.nativeElement);

      // Get the component's injected router and spy on it
      const router = fixture.debugElement.injector.get(Router);
      this.navSpy  = spyOn(router, 'navigate');

      this.pageName      = fixture.debugElement.query(By.css('.admin-message')).nativeElement;
      this.addMessageBtn = fixture.debugElement.query(By.css('#add-message')).nativeElement;
    };
  }
});
