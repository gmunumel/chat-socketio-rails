import {
  async, fakeAsync, ComponentFixture, TestBed, tick,
} from '@angular/core/testing';

// import {
//   ActivatedRoute, ActivatedRouteStub, click, newEvent, Router, RouterStub
// } from '../../testing';

import { By }                   from '@angular/platform-browser';
import { DebugElement }         from '@angular/core';
import { ReactiveFormsModule }  from '@angular/forms';
import { HttpModule }           from '@angular/http';

import { UserDetailComponent } from './user-detail.component';

import { UserService }     from '../../../services/user.service';
import { SessionService }  from '../../../services/session.service';
import { FakeUserService } from '../../../../testing/services/fake-user.service';

describe('UserDetailComponent', function () {
  let de: DebugElement;
  let comp: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, HttpModule ],
      declarations: [ UserDetailComponent ],
      providers: [ SessionService ],
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

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('h1'));
  });

  it('should search component', () => expect(comp).toBeDefined());

  it('should have expected <h1> text', () => {
    fixture.detectChanges();
    const h1 = de.nativeElement;
    expect(h1.innerText).toMatch(/admin user detail/i,
      '<h1> should say something about "Admin User Detail"');
  });

  it('user should update from form changes', fakeAsync(() => {
    const validTestUser = {
      name: 'testUserName',
      email: 'test@test.com',
    };
    updateForm(validTestUser.name, validTestUser.email);
    expect(comp.userDetailForm.value).toEqual(validTestUser);
  }));

  it('isValid should be false when form is invalid', fakeAsync(() => {
    const isvalidTestUser = {
      name: 'testUserName',
      email: 'test@',
    };
    updateForm(isvalidTestUser.name, isvalidTestUser.email);
    expect(comp.userDetailForm.valid).toBeFalsy();
  }));

  it('should update model on submit', fakeAsync(() => {
    const validTestUser = {
      name: 'Ted',
      email: 'ted@example.com',
    };
    updateForm(validTestUser.name, validTestUser.email);
    comp.save();
    tick();
    expect(comp.userDetailForm.value).toEqual(validTestUser);
  }));

  //////// Helper //////
  // create reusable function for a dry spec.
  function updateForm(userEmail: string, userPassword: string) {
    comp.userDetailForm.controls['name'].setValue(userEmail);
    comp.userDetailForm.controls['email'].setValue(userPassword);
  }

  // class Page {
  //   goBackSpy:      jasmine.Spy;
  //   locSpy:         jasmine.Spy;

  //   saveBtn:        DebugElement;
  //   cancelBtn:      DebugElement;
  //   nameDisplay:    HTMLElement;
  //   nameInput:      HTMLInputElement;

  //   constructor() {
  //     const router   = TestBed.get(Router); // get router from root injector
  //     this.goBackSpy = spyOn(comp, 'goBack').and.callThrough();
  //     this.locSpy    = spyOn(location, 'navigate');
  //   }

  //   // Add page elements after hero arrives 
  //   addPageElements() {
  //     if (comp.hero) {
  //       // have a hero so these elements are now in the DOM
  //       const buttons    = fixture.debugElement.queryAll(By.css('button'));
  //       this.saveBtn     = buttons[0];
  //       this.cancelBtn   = buttons[1];
  //       this.nameDisplay = fixture.debugElement.query(By.css('span')).nativeElement;
  //       this.nameInput   = fixture.debugElement.query(By.css('input')).nativeElement;
  //     }
  //   }
  // }
});


