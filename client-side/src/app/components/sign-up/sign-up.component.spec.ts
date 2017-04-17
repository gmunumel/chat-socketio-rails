import {
  async, fakeAsync, ComponentFixture, TestBed
} from '@angular/core/testing';

import { By }                   from '@angular/platform-browser';
import { DebugElement }         from '@angular/core';
import { ReactiveFormsModule }  from '@angular/forms';
import { HttpModule }           from '@angular/http';

import { SignUpComponent } from './sign-up.component';

import { UserService } from '../../services/user.service';
import { FakeUserService } from '../../../testing/services/fake-user.service';

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
    const validTestUser = {
      name: 'testUserName',
      email: 'test@test.com',
    };
    updateForm(validTestUser.name, validTestUser.email);
    expect(comp.signUpForm.value).toEqual(validTestUser);
  }));

  it('isValid should be false when form is invalid', fakeAsync(() => {
    const isvalidTestUser = {
      name: 'testUserName',
      email: 'test@',
    };
    updateForm(isvalidTestUser.name, isvalidTestUser.email);
    expect(comp.signUpForm.valid).toBeFalsy();
  }));

  it('should update model on submit', fakeAsync(() => {
    const validTestUser = {
      name: 'testUserName',
      email: 'test@test.com',
    };
    updateForm(validTestUser.name, validTestUser.email);
    comp.doSignUp();
    expect(comp.signUpForm.value).toEqual(validTestUser);
  }));


  //////// Helper //////
  // create reusable function for a dry spec.
  function updateForm(userEmail: string, userPassword: string) {
    comp.signUpForm.controls['name'].setValue(userEmail);
    comp.signUpForm.controls['email'].setValue(userPassword);
  }
});
