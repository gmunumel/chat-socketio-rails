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

import { UserDetailComponent }  from './user-detail.component';

import { UserService }          from '../../../services/user.service';
import {
  USERS, FakeUserService
}                               from '../../../../testing/services/fake-user.service';

const firstUser = USERS[0];

describe('UserDetailComponent', function () {
  let activatedRoute: ActivatedRouteStub;
  let comp: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let page: Page;

  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, HttpModule ],
      declarations: [ UserDetailComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router,         useClass: RouterStub},
      ]
    })
    .overrideComponent(UserDetailComponent, {
      set: {
        providers: [
          { provide: UserService, useClass: FakeUserService },
        ]
      }
    })
    .compileComponents();
  }));

  describe('when navigate to existing user', () => {
    beforeEach( async(() => {
      activatedRoute.testParams = { id: firstUser.id };
      createComponent();
    }));

    it('should create component', () => expect(comp).toBeDefined() );

    it('should have expected <h1> text', () => {
      expect(page.pageName.textContent).toMatch(/admin user detail/i,
        '<h1> should say something about "Admin User Detail"');
    });

    it('user should update from form changes', fakeAsync(() => {
      comp.userDetailForm.patchValue(firstUser);
      expect(comp.userDetailForm.value.name).toEqual(firstUser.name);
      expect(comp.userDetailForm.value.email).toEqual(firstUser.email);
    }));

    it('should be false when form is invalid', fakeAsync(() => {
      const invalidTestUser = {
        name: 'testUserName',
        email: 'test@',
      };
      comp.userDetailForm.patchValue(invalidTestUser);
      expect(comp.userDetailForm.valid).toBeFalsy();
    }));

    it('should update model on submit', fakeAsync(() => {
      comp.userDetailForm.patchValue(firstUser);
      comp.save();
      tick();
      expect(comp.response).toBe(1);
      expect(page.navSpy.calls.any()).toBe(true, 'router.navigate called');
    }));
  });

  describe('when navigate with user id -1', () => {
    beforeEach( async(() => {
      activatedRoute.testParams = { id: -1 };
      createComponent();
    }));

    it('should have user.id === -1', () => {
      expect(comp.userDetailForm.value.id).toBe(-1);
    });

    it('should display empty user name', () => {
      expect(page.nameDisplay.textContent).toBe('');
    });
  });

  describe('when navigate to non-existant user id', () => {
    beforeEach( async(() => {
      activatedRoute.testParams = { id: 99999 };
      createComponent();
    }));

    it('should try to navigate back to user list', fakeAsync(() => {
      tick();
      expect(page.goBackSpy.calls.any()).toBe(true, 'comp.goBack called');
      expect(page.navSpy.calls.any()).toBe(true, 'router.navigate called');
    }));
  });

  /////////// Helpers /////

  // Create the UserDetailComponent, initialize it, set test variables 
  function createComponent() {
    fixture = TestBed.createComponent(UserDetailComponent);
    comp    = fixture.componentInstance;
    page    = new Page();

    // 1st change detection triggers ngOnInit which gets a user
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      // 2nd change detection displays the async-fetched user
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

    // Add page elements after user arrives 
    addPageElements() {
      if (comp.userDetailForm) {
        // have a form group element so these elements are now in the DOM
        const buttons    = fixture.debugElement.queryAll(By.css('button'));
        this.cancelBtn   = buttons[0];
        this.saveBtn     = buttons[1];
        this.pageName    = fixture.debugElement.query(By.css('.admin-user-detail')).nativeElement;
        this.nameDisplay = fixture.debugElement.query(By.css('#name')).nativeElement;
      }
    }
  }
});


