import {
  async, fakeAsync, ComponentFixture, TestBed, tick
} from '@angular/core/testing';

import { By }                   from '@angular/platform-browser';
import { DebugElement }         from '@angular/core';
import { ReactiveFormsModule }  from '@angular/forms';
import { HttpModule }           from '@angular/http';

import { SignUpComponent } from './sign-up.component';

import { UserService }     from '../../services/user.service';
import {
 USERS, FakeUserService
}                          from '../../../testing/services/fake-user.service';

const firstUser = USERS[0];

describe('SignUpComponent', function () {
  let de: DebugElement;
  let comp: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, HttpModule ],
      declarations: [ SignUpComponent ],
    })
    .overrideComponent(SignUpComponent, {
      set: {
        providers: [
          { provide: UserService, useClass: FakeUserService },
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('h1'));
  });

  it('should create component', () => expect(comp).toBeDefined() );

  it('should have expected <h1> text', () => {
    fixture.detectChanges();
    const h1 = de.nativeElement;
    expect(h1.innerText).toMatch(/sign up/i,
      '<h1> should say something about "Sign Up"');
  });

  it('user should update from form changes', fakeAsync(() => {
    comp.signUpForm.patchValue(firstUser);
    expect(comp.signUpForm.value.name).toEqual(firstUser.name);
    expect(comp.signUpForm.value.email).toEqual(firstUser.email);
  }));

  it('isValid should be false when form is invalid', fakeAsync(() => {
    const isvalidTestUser = {
      name: 'testUserName',
      email: 'test@',
    };
    comp.signUpForm.patchValue(isvalidTestUser);
    expect(comp.signUpForm.valid).toBeFalsy();
  }));

  it('should not create an user who already exists', fakeAsync(() => {
    comp.signUpForm.patchValue(firstUser);
    comp.doSignUp();
    tick();
    expect(comp.response).toEqual(-2);
  }));

  it('should update model on submit', fakeAsync(() => {
    const validTestUser = {
      name: 'testUserName',
      email: 'testUserName@example.com',
    };
    comp.signUpForm.patchValue(validTestUser);
    comp.doSignUp();
    tick();
    expect(comp.response).toEqual(1);
    expect(comp.signUpForm.value.name).toEqual(validTestUser.name);
    expect(comp.signUpForm.value.email).toEqual(validTestUser.email);
  }));
});
