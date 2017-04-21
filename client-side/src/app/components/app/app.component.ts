import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription }   from 'rxjs/Subscription';

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
  subscription: Subscription;

  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
    this.subscription = this.sessionService.collection$.subscribe(latestCollection => {
      this.userName = latestCollection[0];
      this.userEmail = latestCollection[1];
    });
    
    this.sessionService.load();
  }

  toggleSidebar(): void {
    if (this.toggled === 'toggled') {
       this.toggled = '';
    } else {
       this.toggled = 'toggled';
    }
  }

  logOut(): void {
    this.sessionService.clear();
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
