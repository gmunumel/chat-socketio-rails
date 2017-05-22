import {
  async, fakeAsync, ComponentFixture, TestBed, tick,
}                               from '@angular/core/testing';

import {
  ActivatedRoute, ActivatedRouteStub, newEvent, Router, RouterStub
}                               from '../../../../testing';

import { By }                   from '@angular/platform-browser';
import { ReactiveFormsModule }  from '@angular/forms';
import { HttpModule }           from '@angular/http';

import { MessageDetailComponent } from './message-detail.component';

import { MessageService }         from '../../../services/message.service';

import { MESSAGES, FakeMessageService } from '../../../../testing/services/fake-message.service';
import { CHATROOMS }                    from '../../../../testing/services/fake-chat-room.service';

const firstMessage = MESSAGES[0];
const firstChatRoom = CHATROOMS[0];

describe('MessageDetailComponent', function () {
  let activatedRoute: ActivatedRouteStub;
  let comp: MessageDetailComponent;
  let fixture: ComponentFixture<MessageDetailComponent>;
  let page: Page;

  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, HttpModule ],
      declarations: [ MessageDetailComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router,         useClass: RouterStub },
      ]
    })
    .overrideComponent(MessageDetailComponent, {
      set: {
        providers: [
          { provide: MessageService, useClass: FakeMessageService },
        ]
      }
    })
    .compileComponents();
  }));

  describe('when navigate to existing message', () => {
    beforeEach( async(() => {
      activatedRoute.testParams = { id: firstMessage.id, chat_room_id: firstChatRoom.id };
      createComponent();
    }));

    it('should create component', () => expect(comp).toBeDefined() );

    it('should have expected <h1> text', () => {
      expect(page.pageName.textContent).toMatch(/admin message detail/i,
        '<h1> should say something about "Admin Message Detail"');
    });

    it('user should update from form changes', fakeAsync(() => {
      comp.messageDetailForm.patchValue(firstMessage);
      expect(comp.messageDetailForm.value.body).toEqual(firstMessage.body);
      expect(comp.messageDetailForm.value.user_id).toEqual(1);
      expect(comp.messageDetailForm.value.chat_room_id).toEqual(0);
    }));

    it('should be false when form is invalid', fakeAsync(() => {
      const invalidTestMessage = {
        body: '',
        user_id: 1,
        chat_room_id: 1
      };
      comp.messageDetailForm.patchValue(invalidTestMessage);
      expect(comp.messageDetailForm.valid).toBeFalsy();
    }));

    it('should update model on submit', fakeAsync(() => {
      comp.chatRoomId = firstChatRoom.id;
      comp.messageDetailForm.patchValue(firstMessage);
      comp.update();
      tick();
      expect(comp.response).toBe(1);
      expect(page.navSpy.calls.any()).toBe(true, 'router.navigate called');
    }));

    it('should navigate to go back when delete message on click', fakeAsync(() => {
      const btn = page.deleteBtn;
      btn.dispatchEvent(newEvent('click'));
      tick();

      expect(page.goBackSpy.calls.any()).toBe(true, 'comp.goBack called');
      expect(page.navSpy.calls.any()).toBe(true, 'router.navigate called');
    }));

    it('should navigate to go back when go back click', fakeAsync(() => {
      const btn = page.goBackBtn;
      btn.dispatchEvent(newEvent('click'));
      tick();

      expect(page.goBackSpy.calls.any()).toBe(true, 'comp.goBack called');
      expect(page.navSpy.calls.any()).toBe(true, 'router.navigate called');
    }));
  });

  describe('when navigate to non-existant message id', () => {
    beforeEach( async(() => {
      activatedRoute.testParams = { id: 99999, chat_room_id: firstChatRoom.id };
      createComponent();
    }));

    it('should try to navigate back to message list', fakeAsync(() => {
      tick();
      expect(page.goBackSpy.calls.any()).toBe(true, 'comp.goBack called');
      expect(page.navSpy.calls.any()).toBe(true, 'router.navigate called');
    }));
  });

  describe('when navigate to non-existant message id and chat room id', () => {
    beforeEach( async(() => {
      activatedRoute.testParams = { id: 99999, chat_room_id: 99999 };
      createComponent();
    }));

    it('should try to navigate back to message list', fakeAsync(() => {
      tick();
      expect(page.goBackSpy.calls.any()).toBe(true, 'comp.goBack called');
      expect(page.navSpy.calls.any()).toBe(true, 'router.navigate called');
    }));
  });

  describe('when navigate to existant message id and not existant chat room id', () => {
    beforeEach( async(() => {
      activatedRoute.testParams = { id: firstMessage.id, chat_room_id: 99999 };
      createComponent();
    }));

    it('should try to navigate back to message list', fakeAsync(() => {
      tick();
      expect(page.goBackSpy.calls.any()).toBe(true, 'comp.goBack called');
      expect(page.navSpy.calls.any()).toBe(true, 'router.navigate called');
    }));
  });

  /////////// Helpers /////

  // Create the MessageDetailComponent, initialize it, set test variables  
  function createComponent() {
    fixture = TestBed.createComponent(MessageDetailComponent);
    comp    = fixture.componentInstance;
    page    = new Page();

    // 1st change detection triggers ngOnInit which gets a message
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      // 2nd change detection displays the async-fetched message
      fixture.detectChanges();
      page.addPageElements();
    });
  }

  class Page {
    goBackSpy:      jasmine.Spy;
    navSpy:         jasmine.Spy;

    goBackBtn:      HTMLInputElement;
    deleteBtn:      HTMLInputElement;
    pageName:       HTMLInputElement;
    nameDisplay:    HTMLInputElement;

    constructor() {
      const router   = TestBed.get(Router); // get router from root injector
      this.goBackSpy = spyOn(comp, 'goBack').and.callThrough();
      this.navSpy    = spyOn(router, 'navigate');
    }

    // Add page elements after message arrives 
    addPageElements() {
      if (comp.messageDetailForm) {
        // have a form group element so these elements are now in the DOM
        this.goBackBtn   = fixture.debugElement.query(By.css('#message-detail-back')).nativeElement;
        this.deleteBtn   = fixture.debugElement.query(By.css('#message-detail-delete')).nativeElement;
        this.pageName    = fixture.debugElement.query(By.css('.admin-message-detail')).nativeElement;
        this.nameDisplay = fixture.debugElement.query(By.css('#body')).nativeElement;
      }
    }
  }
});
