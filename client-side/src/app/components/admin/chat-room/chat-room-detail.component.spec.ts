import {
  async, fakeAsync, ComponentFixture, TestBed, tick,
} from '@angular/core/testing';

import {
  ActivatedRoute, ActivatedRouteStub, Router, RouterStub
} from '../../../../testing';

import { By }                   from '@angular/platform-browser';
import { DebugElement }         from '@angular/core';
import { ReactiveFormsModule }  from '@angular/forms';
import { HttpModule }           from '@angular/http';

import { ChatRoomDetailComponent }  from './chat-room-detail.component';

import { ChatRoomService }      from '../../../services/chat-room.service';
import {
  CHATROOMS, FakeChatRoomService
}                               from '../../../../testing/services/fake-chat-room.service';

const firstChatRoom = CHATROOMS[0];

describe('ChatRoomDetailComponent', function () {
  let activatedRoute: ActivatedRouteStub;
  let comp: ChatRoomDetailComponent;
  let fixture: ComponentFixture<ChatRoomDetailComponent>;
  let page: Page;

  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, HttpModule ],
      declarations: [ ChatRoomDetailComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router,         useClass: RouterStub},
      ]
    })
    .overrideComponent(ChatRoomDetailComponent, {
      set: {
        providers: [
          { provide: ChatRoomService, useClass: FakeChatRoomService },
        ]
      }
    })
    .compileComponents();
  }));

  describe('when navigate to existing chat room', () => {
    beforeEach( async(() => {
      activatedRoute.testParams = { id: firstChatRoom.id };
      createComponent();
    }));

    it('should create component', () => expect(comp).toBeDefined() );

    it('should have expected <h1> text', () => {
      expect(page.pageName.textContent).toMatch(/admin chat room detail/i,
        '<h1> should say something about "Admin Chat Room Detail"');
    });

    it('chat room should update from form changes', fakeAsync(() => {
      comp.chatRoomDetailForm.patchValue(firstChatRoom);
      expect(comp.chatRoomDetailForm.value.title).toEqual(firstChatRoom.title);
      expect(comp.chatRoomDetailForm.value.created_id).toEqual(1);
    }));

    it('should be false when form is invalid', fakeAsync(() => {
      const invalidTestChatRoom = {
        title: '',
        created_id: 1,
      };
      comp.chatRoomDetailForm.patchValue(invalidTestChatRoom);
      expect(comp.chatRoomDetailForm.valid).toBeFalsy();
    }));

    it('should update model on submit', fakeAsync(() => {
      comp.chatRoomDetailForm.patchValue(firstChatRoom);
      comp.save();
      tick();
      expect(comp.response).toBe(1);
      expect(page.navSpy.calls.any()).toBe(true, 'router.navigate called');
    }));
  });

  describe('when navigate with chat room id -1', () => {
    beforeEach( async(() => {
      activatedRoute.testParams = { id: -1 };
      createComponent();
    }));

    it('should have chatRoom.id === -1', () => {
      expect(comp.chatRoomDetailForm.value.id).toBe(-1);
    });

    it('should display empty chat room title', () => {
      expect(page.nameDisplay.textContent).toBe('');
    });

    it('should have chatRoom.created_id === 1', () => {
      expect(comp.chatRoomDetailForm.value.created_id).toBe(1);
    });

    it('should have chatRoom.sender_id === 1', () => {
      expect(comp.chatRoomDetailForm.value.sender_id).toBe(1);
    });

    it('should have chatRoom.recipient_id === 1', () => {
      expect(comp.chatRoomDetailForm.value.recipient_id).toBe(1);
    });
  });

  describe('when navigate to non-existant chat room id', () => {
    beforeEach( async(() => {
      activatedRoute.testParams = { id: 99999 };
      createComponent();
    }));

    it('should try to navigate back to chat room list', fakeAsync(() => {
      tick();
      expect(page.goBackSpy.calls.any()).toBe(true, 'comp.goBack called');
      expect(page.navSpy.calls.any()).toBe(true, 'router.navigate called');
    }));
  });

  /////////// Helpers /////

  // Create the ChatRoomDetailComponent, initialize it, set test variables  
  function createComponent() {
    fixture = TestBed.createComponent(ChatRoomDetailComponent);
    comp    = fixture.componentInstance;
    page    = new Page();

    // 1st change detection triggers ngOnInit which gets a chat room
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      // 2nd change detection displays the async-fetched chat room
      fixture.detectChanges();
      page.addPageElements();
    });
  }

  class Page {
    goBackSpy:      jasmine.Spy;
    navSpy:         jasmine.Spy;

    saveBtn:        DebugElement;
    cancelBtn:      DebugElement;

    pageName:       HTMLInputElement;
    nameDisplay:    HTMLInputElement;

    constructor() {
      const router   = TestBed.get(Router); // get router from root injector
      this.goBackSpy = spyOn(comp, 'goBack').and.callThrough();
      this.navSpy    = spyOn(router, 'navigate');
    }

    // Add page elements after chat room arrives 
    addPageElements() {
      if (comp.chatRoomDetailForm) {
        // have a form group element so these elements are now in the DOM
        const buttons    = fixture.debugElement.queryAll(By.css('button'));
        this.cancelBtn   = buttons[0];
        this.saveBtn     = buttons[1];
        this.pageName    = fixture.debugElement.query(By.css('.admin-chat-room-detail')).nativeElement;
        this.nameDisplay = fixture.debugElement.query(By.css('#title')).nativeElement;
      }
    }
  }
});


