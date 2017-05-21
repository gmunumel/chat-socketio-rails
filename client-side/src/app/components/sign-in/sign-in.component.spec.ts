import {
  async, fakeAsync, ComponentFixture, TestBed, tick,
} from '@angular/core/testing';

import { By }                   from '@angular/platform-browser';
import { DebugElement }         from '@angular/core';
import { ReactiveFormsModule }  from '@angular/forms';
import { HttpModule }           from '@angular/http';

import { SignInComponent } from './sign-in.component';

import { UserService }     from '../../services/user.service';
import { SessionService }  from '../../services/session.service';
import {
  USERS, FakeUserService
}                          from '../../../testing/services/fake-user.service';

const firstUser = USERS[0];

describe('SignInComponent', function () {
  let de: DebugElement;
  let comp: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, HttpModule ],
      declarations: [ SignInComponent ],
      providers: [ SessionService ],
    })
    .overrideComponent(SignInComponent, {
      set: {
        providers: [
          { provide: UserService, useClass: FakeUserService },
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('h1'));
  });

  it('should search component', () => expect(comp).toBeDefined());

  it('should have expected <h1> text', () => {
    fixture.detectChanges();
    const h1 = de.nativeElement;
    expect(h1.innerText).toMatch(/sign in/i,
      '<h1> should say something about "Sign In"');
  });

  it('user should update from form changes', fakeAsync(() => {
    comp.signInForm.patchValue(firstUser);
    expect(comp.signInForm.value.name).toEqual(firstUser.name);
    expect(comp.signInForm.value.email).toEqual(firstUser.email);
  }));

  it('isValid should be false when form is invalid', fakeAsync(() => {
    const isvalidTestUser = {
      name: 'testUserName',
      email: 'test@',
    };
    comp.signInForm.patchValue(isvalidTestUser);
    expect(comp.signInForm.valid).toBeFalsy();
  }));

  it('should update model on submit', fakeAsync(() => {
    SessionService.getInstance().collection$.subscribe(() => {});
    SessionService.getInstance().clear();
    comp.signInForm.patchValue(firstUser);
    comp.doSignIn();
    tick();
    expect(comp.response).toEqual(1);
    expect(localStorage.getItem('userName')).toEqual(firstUser.name);
    expect(localStorage.getItem('userEmail')).toEqual(firstUser.email);
    expect(comp.signInForm.value.name).toEqual(firstUser.name);
    expect(comp.signInForm.value.email).toEqual(firstUser.email);
  }));

  afterAll(() => {
    SessionService.getInstance().clear();
  });
});
