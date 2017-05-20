import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';

@Injectable()
export class SessionService {
  static instance: SessionService;
  public collection$: Observable<Array<string>>;
  private collectionObserver: any;
  private collection: Array<string>;

  static getInstance() {
    if (SessionService.instance == null) {
        SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  constructor() {
    this.collection = new Array<string>();

    this.collection$ = new Observable((observer: any) => {
      this.collectionObserver = observer;
    }).share();
  }

  setUserId(userId: string): void {
    let userIdStorage: string = localStorage.getItem('userId');
    if (userIdStorage) {
      return;
    }
    localStorage.setItem('userId', userId);
    this.collection.push(userId);
    this.collectionObserver.next(this.collection);
  }

  setUserName(userName: string): void {
    let userNameStorage: string = localStorage.getItem('userName');
    if (userNameStorage) {
      return;
    }
    localStorage.setItem('userName', userName);
    this.collection.push(userName);
    this.collectionObserver.next(this.collection);
  }

  setUserEmail(userEmail: string): void {
    let userEmailStorage: string = localStorage.getItem('userEmail');
    if (userEmailStorage) {
      return;
    }
    localStorage.setItem('userEmail', userEmail);
    this.collection.push(userEmail);
    this.collectionObserver.next(this.collection);
  }

  isLoggedIn(): boolean {
    let userId: string = localStorage.getItem('userId');
    let userName: string = localStorage.getItem('userName');
    let userEmail: string = localStorage.getItem('userEmail');
    return (userId && userName && userEmail) ? true : false;
  }

  load(): void {
    let userId: string = localStorage.getItem('userId');
    let userName: string = localStorage.getItem('userName');
    let userEmail: string = localStorage.getItem('userEmail');
    if (userId && userName && userEmail) {
      this.collection.push(userId);
      this.collection.push(userName);
      this.collection.push(userEmail);
    }
    this.collectionObserver.next(this.collection);
  }

  clear(): void {
    localStorage.clear();
    this.collection = [];
    this.collectionObserver.next(this.collection);
  }
}
