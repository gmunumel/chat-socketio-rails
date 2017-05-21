import {
  async, fakeAsync, ComponentFixture, TestBed, tick
} from '@angular/core/testing';

import {
  newEvent, Router, RouterStub
} from '../../../../testing';

import { By }                  from '@angular/platform-browser';
import { HttpModule }          from '@angular/http';

import { ChatRoomComponent }   from './chat-room.component';

import { ChatRoomService }     from '../../../services/chat-room.service';
import {
  CHATROOMS, FakeChatRoomService
}                              from '../../../../testing/services/fake-chat-room.service';

describe('ChatRoomComponent', function () {
  let comp: ChatRoomComponent;
  let fixture: ComponentFixture<ChatRoomComponent>;
  let page: Page;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      declarations: [ ChatRoomComponent ],
      providers: [
        { provide: Router, useClass: RouterStub},
      ]
    })
    .overrideComponent(ChatRoomComponent, {
      set: {
        providers: [
          { provide: ChatRoomService, useClass: FakeChatRoomService },
        ]
      }
    })
    .compileComponents()
    .then(createComponent);
  }));

  it('should create component', () => expect(comp).toBeDefined() );

  it('should have expected <h1> text', () => {
    expect(page.pageName.textContent).toMatch(/admin chat room/i,
      '<h1> should say something about "Admin Chat Room"');
  });

  it('should display chat rooms', () => {
    const allChatRooms = CHATROOMS;
    const displayChatRooms = page.chatRoomRows;
    expect(page.chatRoomRows.length).toBeGreaterThan(0);
    expect(allChatRooms.length).toBe(displayChatRooms.length);
  });

  it('1st chat room should match 1st chat room', () => {
    const expectedChatRoom = CHATROOMS[0];
    const actualChatRoom = page.chatRoomRows[0].value;
    expect(actualChatRoom).toContain(expectedChatRoom.title, 'chatRoom.title');
  });

  it('should navigate to selected chat room detail on click', fakeAsync(() => {
    const expectedChatRoom = CHATROOMS[1];
    const input = page.chatRoomRows[1];
    input.dispatchEvent(newEvent('click'));
    tick();

    // should have navigated
    expect(page.navSpy.calls.any()).toBe(true, 'navigate called');

    // composed chat room detail will be URL like 'chat-rooms/42'
    // expect link array with the route path and chat room id
    // first argument to router.navigate is link array
    const navArgs = page.navSpy.calls.first().args[0];
    expect(navArgs[0]).toContain('chat-room', 'nav to chat room detail URL');
    expect(navArgs[1]).toBe(expectedChatRoom.id, 'expected chatRoom.id');

  }));

  it('should navigate to add chat room on click', fakeAsync(() => {
    const btn = page.addChatRoomBtn;
    btn.dispatchEvent(newEvent('click'));
    tick();

    // should have navigated
    expect(page.navSpy.calls.any()).toBe(true, 'navigate called');

    // composed chat room detail will be URL like 'chat-rooms/42'
    // expect link array with the route path and chat room id
    // first argument to router.navigate is link array
    const navArgs = page.navSpy.calls.first().args[0];
    expect(navArgs[0]).toContain('chat-room', 'nav to chat room detail URL');
    expect(navArgs[1]).toBe(-1, 'expected to be -1');

  }));

  it('should delete a chat room', fakeAsync(() => {
    const deletedChatRoom = CHATROOMS[1];
    const oldChatRoomsLength = page.chatRoomRows.length;

    comp.delete(deletedChatRoom);
    tick();

    expect(comp.response).toBe(1);

    // wait for ui to be complete updated
    fixture.whenStable().then(() => {
        fixture.detectChanges();

        const newChatRooms = fixture.debugElement.queryAll(By.css('.chat-rooms')).map(de => de.nativeElement);
        const newChatRoomsLength = newChatRooms.length;

        expect(newChatRoomsLength).toBe(oldChatRoomsLength - 1, 'no of chat rooms must be minus one');
        expect(newChatRooms.some((chatRoomTitle: any) => chatRoomTitle === deletedChatRoom.title))
                .toBe(false, 'chat room does not exists');
    });
  }));

  /////////// Helpers /////
  // Create the component and set the `page` test variables 
  function createComponent() {
    fixture = TestBed.createComponent(ChatRoomComponent);
    comp = fixture.componentInstance;

    // change detection triggers ngOnInit which gets an chat room
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      // got the chat rooms and updated component
      // change detection updates the view
      fixture.detectChanges();
      page = new Page();
    });
  }

  class Page {
    // Chat Room  line elements 
    chatRoomRows:   HTMLLIElement[];

    pageName:       HTMLInputElement;
    addChatRoomBtn: HTMLInputElement;

    // Spy on router navigate method 
    navSpy:         jasmine.Spy;

    constructor() {
      this.chatRoomRows = fixture.debugElement.queryAll(By.css('.chat-rooms')).map(de => de.nativeElement);

      // Get the component's injected router and spy on it
      const router = fixture.debugElement.injector.get(Router);
      this.navSpy  = spyOn(router, 'navigate');

      this.pageName       = fixture.debugElement.query(By.css('.admin-chat-room')).nativeElement;
      this.addChatRoomBtn = fixture.debugElement.query(By.css('#add-chat-room')).nativeElement;
    };
  }
});
