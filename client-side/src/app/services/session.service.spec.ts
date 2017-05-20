import {
   async, inject, TestBed
} from '@angular/core/testing';

import { SessionService } from './session.service';

describe('SessionService test', () => {

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      providers: [ SessionService ]
    })
    .compileComponents();
    SessionService.getInstance().collection$.subscribe(() => {});
  }));

  it('can instantiate service when inject service',
    inject([SessionService], (service: SessionService) => {
      expect(service instanceof SessionService).toBe(true);
  }));

  it('can instantiate service with "new"', inject([], () => {
    let service = new SessionService();
    expect(service instanceof SessionService).toBe(true, 'new service should be ok');
  }));

  it('can set user id', async(() => {
    let userId = '0';
    let service = SessionService.getInstance();
    SessionService.getInstance().clear();
    service.setUserId(userId);
    expect(localStorage.getItem('userId')).toEqual(userId);
  }));

  it('can set user name', async(() => {
    let userName = 'test';
    let service = SessionService.getInstance();
    SessionService.getInstance().clear();
    service.setUserName(userName);
    expect(localStorage.getItem('userName')).toEqual(userName);
  }));

  it('can set user email', async(() => {
    let userEmail = 'test@example.com';
    let service = SessionService.getInstance();
    SessionService.getInstance().clear();
    service.setUserEmail(userEmail);
    expect(localStorage.getItem('userEmail')).toEqual(userEmail);
  }));

  describe('when logged in user', () => {

    it('returns false', async(() => {
      let service = SessionService.getInstance();
      expect(service.isLoggedIn()).toBe(false);
    }));

    it('returns true', async(() => {
      let userId = '0';
      let userName = 'test';
      let userEmail = 'test@example.com';
      let service = SessionService.getInstance();
      service.setUserId(userId);
      service.setUserName(userName);
      service.setUserEmail(userEmail);
      expect(service.isLoggedIn()).toBe(true);
    }));
  });

  it('can clear all data', async(() => {
    expect(localStorage.getItem('userId')).not.toBeNull();
    expect(localStorage.getItem('userName')).not.toBeNull();
    expect(localStorage.getItem('userEmail')).not.toBeNull();
    SessionService.getInstance().clear();
    expect(localStorage.getItem('userId')).toBeNull();
    expect(localStorage.getItem('userName')).toBeNull();
    expect(localStorage.getItem('userEmail')).toBeNull();
  }));
});
