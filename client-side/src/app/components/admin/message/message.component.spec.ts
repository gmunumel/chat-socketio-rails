import {
  async, fakeAsync, ComponentFixture, TestBed, tick
} from '@angular/core/testing';

import { newEvent, Router, RouterStub } from '../../../../testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By }                     from '@angular/platform-browser';
import { HttpModule }             from '@angular/http';

import { MessageComponent }   from './message.component';

import { MessageService }     from '../../../services/message.service';
import {
  MESSAGES, FakeMessageService
}                             from '../../../../testing/services/fake-message.service';

const firstChatRoomId = MESSAGES[0].chat_room_id;

describe('MessageComponent', function () {
  let comp: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;
  let page: Page;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      declarations: [ MessageComponent ],
      providers: [
        { provide: Router, useClass: RouterStub }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .overrideComponent(MessageComponent, {
      set: {
        providers: [
          { provide: MessageService, useClass: FakeMessageService },
        ]
      }
    })
    .compileComponents()
    .then(createComponent);
  }));

  it('should create component', () => expect(comp).toBeDefined() );

  it('should have expected <h1> text', () => {
    expect(page.pageName.textContent).toMatch(/admin message/i,
      '<h1> should say something about "Admin Message"');
  });

  it('should display all messages for chat id 1', fakeAsync(() => {
    const allMessages = MESSAGES;
    comp.showMessage(firstChatRoomId);
    tick();
    expect(comp.response).toBe(1);
    expect(comp.messages.length).toBe(allMessages.length);
  }));

  it('1st message should match 1st chat room message', fakeAsync(() => {
    comp.showMessage(firstChatRoomId);
    tick();

    const expectedMessage = MESSAGES[0];
    const actualMessage = page.messagesRows[0].value;
    expect(actualMessage).toContain(expectedMessage.body, 'message.body');
  }));

  it('should navigate to selected message detail on click', fakeAsync(() => {
    const expectedMessage = MESSAGES[1];
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
    expect(navArgs[1]).toBe(expectedMessage.id, 'expected message.id');
  }));

  it('should add new message', () => {
    // TODO
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
