import { Injectable, isDevMode } from '@angular/core';

import { CONFIG } from '../config';

@Injectable()
export class EnvironmentService {
  static instance: EnvironmentService;
  isDevMode: boolean;

  static getInstance() {
    if (EnvironmentService.instance == null) {
        EnvironmentService.instance = new EnvironmentService();
    }
    return EnvironmentService.instance;
  }

  constructor() {
    this.isDevMode = isDevMode() ? true : false;
  }

  getApiUrl(): string {
    return this.isDevMode ? CONFIG.development.API_URL : CONFIG.production.API_URL;
  }

  getSocketUrl(): string {
    return this.isDevMode ? CONFIG.development.SOCKET_URL : CONFIG.production.SOCKET_URL;
  }
}
