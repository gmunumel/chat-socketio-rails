import {
  async, fakeAsync, ComponentFixture, TestBed, tick
} from '@angular/core/testing';

import {
  ActivatedRoute, ActivatedRouteStub, Router, RouterStub
} from '../../../../testing';

import { By }                   from '@angular/platform-browser';
import { DebugElement }         from '@angular/core';
import { ReactiveFormsModule }  from '@angular/forms';
import { HttpModule }           from '@angular/http';

import { UserComponent } from './user.component';

import { UserService }     from '../../../services/user.service';
import { FakeUserService } from '../../../../testing/services/fake-user.service';

describe('UserComponent', function () {
  let de: DebugElement;
  let comp: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, HttpModule ],
      declarations: [ UserComponent ],
      providers: [
        { provide: Router,         useClass: RouterStub},
      ]
    })
    .overrideComponent(UserComponent, {
      set: {
        providers: [
          { provide: UserService, useClass: FakeUserService },
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('h1'));
  });

  it('should create component', () => expect(comp).toBeDefined() );

  it('should have expected <h1> text', () => {
    fixture.detectChanges();
    const h1 = de.nativeElement;
    expect(h1.innerText).toMatch(/admin user/i,
      '<h1> should say something about "Admin User"');
  });
});
