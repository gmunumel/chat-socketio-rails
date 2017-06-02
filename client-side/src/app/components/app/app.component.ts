import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router }         from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

import { User }           from '../../models/user';

import { SessionService } from '../../services/session.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./css/simple-sidebar.css', './css/styles.css'],
  providers: [ SessionService ]
})
export class AppComponent implements OnInit, OnDestroy {
  toggled: string = 'toggled';
  user: User;
  private sessionSubscription: Subscription;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.sessionSubscription = SessionService.getInstance().collection$
      .subscribe((latestCollection: any) => {
        this.user = new User;
        this.user.id = latestCollection[0];
        this.user.name = latestCollection[1];
        this.user.email = latestCollection[2];
    });

    SessionService.getInstance().load();
  }

  toggleSidebar(): void {
    if (this.toggled === 'toggled') {
       this.toggled = '';
    } else {
       this.toggled = 'toggled';
    }
  }

  logOut(): void {
    SessionService.getInstance().clear();
    this.router.navigate(['dashboard']);
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.sessionSubscription.unsubscribe();
  }
}
