import {
  async, fakeAsync, ComponentFixture, TestBed, tick
} from '@angular/core/testing';

import {
  newEvent, Router, RouterStub
} from '../../../../testing';

import { By }                   from '@angular/platform-browser';
import { DebugElement }         from '@angular/core';
import { ReactiveFormsModule }  from '@angular/forms';
import { HttpModule }           from '@angular/http';

import { UserComponent }   from './user.component';

import { UserService }     from '../../../services/user.service';
import {
  USERS, FakeUserService
}                          from '../../../../testing/services/fake-user.service';

describe('UserComponent', function () {
  let comp: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let page: Page;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, HttpModule ],
      declarations: [ UserComponent ],
      providers: [
        { provide: Router, useClass: RouterStub},
      ]
    })
    .overrideComponent(UserComponent, {
      set: {
        providers: [
          { provide: UserService, useClass: FakeUserService },
        ]
      }
    })
    .compileComponents()
    .then(createComponent);
  }));

  it('should create component', () => expect(comp).toBeDefined() );

  it('should have expected <h1> text', () => {
    expect(page.pageName.textContent).toMatch(/admin user/i,
      '<h1> should say something about "Admin User"');
  });

  it('should display users', () => {
    expect(page.userRows.length).toBeGreaterThan(0);
  });

  it('1st user should match 1st test user', () => {
    const expectedUser = USERS[0];
    const actualUser = page.userRows[0].value;
    expect(actualUser).toContain(expectedUser.name, 'user.name');
  });

  it('should navigate to selected user detail on click', fakeAsync(() => {
    const expectedUser = USERS[1];
    const li = page.userRows[1];
    li.dispatchEvent(newEvent('click'));
    tick();

    // should have navigated
    expect(page.navSpy.calls.any()).toBe(true, 'navigate called');

    // composed user detail will be URL like 'users/42'
    // expect link array with the route path and user id
    // first argument to router.navigate is link array
    const navArgs = page.navSpy.calls.first().args[0];
    expect(navArgs[0]).toContain('user', 'nav to user detail URL');
    expect(navArgs[1]).toBe(expectedUser.id, 'expected user.id');

  }));

  /////////// Helpers /////

  // Create the component and set the `page` test variables 
  function createComponent() {
    fixture = TestBed.createComponent(UserComponent);
    comp = fixture.componentInstance;

    // change detection triggers ngOnInit which gets a user
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      // got the users and updated component
      // change detection updates the view
      fixture.detectChanges();
      page = new Page();
    });
  }

  class Page {
    // User line elements 
    userRows: HTMLLIElement[];
    pageName: HTMLInputElement;

    // Highlighted element 
    highlightDe: DebugElement;

    // Spy on router navigate method 
    navSpy: jasmine.Spy;

    constructor() {
      this.userRows    = fixture.debugElement.queryAll(By.css('.users')).map(de => de.nativeElement);

      // Get the component's injected router and spy on it
      const router = fixture.debugElement.injector.get(Router);
      this.navSpy = spyOn(router, 'navigate');

      this.pageName = fixture.debugElement.query(By.css('.admin-user')).nativeElement;
    };
  }
});
