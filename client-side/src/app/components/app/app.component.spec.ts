import { AppComponent } from './app.component';
import { RouterLinkStubDirective, RouterOutletStubComponent } from '../../../testing';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('AppComponent', function () {
  let de: DebugElement;
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let links: RouterLinkStubDirective[];
  let linkDes: DebugElement[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent, RouterLinkStubDirective, RouterOutletStubComponent ]
    })
    .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement.query(By.css('#toggle-sidebar'));

        // trigger initial data binding
        fixture.detectChanges();
        // find DebugElements with an attached RouterLinkStubDirective
        linkDes = fixture.debugElement
          .queryAll(By.directive(RouterLinkStubDirective));

        // get the attached link directive instances using the DebugElement injectors
        links = linkDes
          .map(dex => dex.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
       });
  }));

  it('should create component', () => expect(comp).toBeDefined() );

  it('can get RouterLinks from template', () => {
    expect(links.length).toBe(7, 'should have 7 links');
    expect(links[0].linkParams[0]).toBe('/dashboard', '1st link should go to Dashboard');
    expect(links[1].linkParams[0]).toBe('/signin', '2st link should go to Sign In');
    expect(links[2].linkParams[0]).toBe('/signup', '3st link should go to Sign Up');
    expect(links[3].linkParams[0]).toBe('/about', '4st link should go to About');
  });

  it('can click Sign In link in template', () => {
    const signInLinkDe = linkDes[1];
    const signInLink = links[1];

    expect(signInLink.navigatedTo).toBeNull('link should not have navigated yet');

    signInLinkDe.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(signInLink.navigatedTo[0]).toBe('/signin');
  });

  it('can click Sign Up link in template', () => {
    const signUpLinkDe = linkDes[2];
    const signUpLink = links[2];

    expect(signUpLink.navigatedTo).toBeNull('link should not have navigated yet');

    signUpLinkDe.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(signUpLink.navigatedTo[0]).toBe('/signup');
  });
});
