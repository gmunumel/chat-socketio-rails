import {
  async, fakeAsync, ComponentFixture, TestBed, tick,
} from '@angular/core/testing';

import { By }                   from '@angular/platform-browser';
import { DebugElement }         from '@angular/core';
import { ReactiveFormsModule }  from '@angular/forms';
import { HttpModule }           from '@angular/http';

import { SignInComponent } from './sign-in.component';

import { UserService }     from '../../services/user.service';
import { FakeUserService } from '../../../testing/services/fake-user.service';

describe('SignInComponent', function () {
  let de: DebugElement;
  let comp: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, HttpModule ],
      declarations: [ SignInComponent ]
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
    const validTestUser = {
      name: 'testUserName',
      email: 'test@test.com',
    };
    updateForm(validTestUser.name, validTestUser.email);
    expect(comp.signInForm.value).toEqual(validTestUser);
  }));

  it('isValid should be false when form is invalid', fakeAsync(() => {
    const isvalidTestUser = {
      name: 'testUserName',
      email: 'test@',
    };
    updateForm(isvalidTestUser.name, isvalidTestUser.email);
    expect(comp.signInForm.valid).toBeFalsy();
  }));

  it('should update model on submit', fakeAsync(() => {
    const validTestUser = {
      name: 'testUserName',
      email: 'test@test.com',
    };
    updateForm(validTestUser.name, validTestUser.email);
    comp.doSignIn();
    tick();
    expect(comp.response).toEqual(1);
    expect(localStorage.getItem('userName')).toEqual(validTestUser.name);
    expect(localStorage.getItem('userEmail')).toEqual(validTestUser.email);
    expect(comp.signInForm.value).toEqual(validTestUser);
  }));

  afterAll(() => {
    localStorage.clear();
  });

  //////// Helper //////
  // create reusable function for a dry spec.
  function updateForm(userEmail: string, userPassword: string) {
    comp.signInForm.controls['name'].setValue(userEmail);
    comp.signInForm.controls['email'].setValue(userPassword);
  }
});
