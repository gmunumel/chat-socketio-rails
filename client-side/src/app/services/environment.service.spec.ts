import {
   async, inject, TestBed
} from '@angular/core/testing';

import { EnvironmentService } from './environment.service';

import { CONFIG } from '../config';

describe('EnvironmentService test', () => {
  let envService: EnvironmentService;

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      providers: [ EnvironmentService ]
    })
    .compileComponents();
    envService = new EnvironmentService();
    envService.isDevMode = true;
  }));

  it('can instantiate service when inject service',
    inject([EnvironmentService], (service: EnvironmentService) => {
      expect(service instanceof EnvironmentService).toBe(true);
  }));

  it('can instantiate service with "new"', inject([], () => {
    let service = new EnvironmentService();
    expect(service instanceof EnvironmentService).toBe(true, 'new service should be ok');
  }));

  it('can get api url', async(() => {
    let configApiUrl = CONFIG.development.API_URL;
    let apiUrl = envService.getApiUrl();
    expect(apiUrl).toEqual(configApiUrl, 'api url must be the same');
  }));

  it('can get socket url', async(() => {
    let configSocketUrl = CONFIG.development.SOCKET_URL;
    let socketUrl = envService.getSocketUrl();
    expect(socketUrl).toEqual(configSocketUrl, 'socket url must be the same');
  }));
});
