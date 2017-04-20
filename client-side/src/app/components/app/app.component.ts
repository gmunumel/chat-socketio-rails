import { Component, OnInit } from '@angular/core';

import { SessionService } from '../../services/session.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./css/simple-sidebar.css', './css/styles.css'],
  providers: [ SessionService ]
})
export class AppComponent {
  title: string = 'Simple Chat App';
  toggled: string = 'toggled';
  userName: string = '';
  userEmail: string = '';

  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
    this.userName = this.sessionService.getUserName();
    this.userEmail = this.sessionService.getUserEmail();
  }

  toggleSidebar(): void {
    if (this.toggled === 'toggled') {
       this.toggled = '';
    } else {
       this.toggled = 'toggled';
    }
  }

  ogOut(): void {
    this.sessionService.logOut();
  }
}
