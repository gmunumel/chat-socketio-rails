import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {
  //userName: string = '';
  //userEmail: string = '';

  setUserName(userName: string): void {
    //this.userName = userName;
    localStorage.setItem('userName', userName);
  }

  setUserEmail(userEmail: string): void {
    //this.userName = userEmail;
    localStorage.setItem('userEmail', userEmail);
  }

  getUserName(): string {
    return localStorage.getItem('userName');
    //return this.userName;
  }

  getUserEmail(): string {
    return localStorage.getItem('userEmail');
    //return this.userEmail;
  }

  logOut(): void {
    localStorage.clear();
  }
}