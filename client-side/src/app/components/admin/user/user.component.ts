import {
  Component, OnInit, AfterViewInit
}                            from '@angular/core';
import { Router }            from '@angular/router';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { User }           from '../../../models/user';
import { UserService }    from '../../../services/user.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  providers: [ SessionService ]
})
export class UserComponent implements OnInit, AfterViewInit {
  page: string = 'Admin User';
  response: number = 0;
  users: Observable<User[]>;
  private searchTerms = new Subject<string>();
  private deleteSubject = new Subject();

  constructor(
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    if (!SessionService.getInstance().isLoggedIn()) {
      this.router.navigate(['signin']);
    }

    this.setUsers();
  }

  ngAfterViewInit(): void {
    this.searchTerms.next('');
  }

  gotoDetail(user: User): void {
    this.router.navigate(['/admin/user/detail', user.id]);
  }

  add(): void {
    this.router.navigate(['/admin/user/detail', -1]);
  }

  search(term: string): void {
    // Push a search term into the observable stream.
    this.searchTerms.next(term);
  }

  delete(user: User): void {
    this.userService
        .delete(user)
        .then(() => {
          this.response = 1;
          this.deleteSubject.next({op: 'delete', id: user.id});
        })
        .catch(() => {
          this.response = -1;
        });
  }

  private setUsers(): void {
    this.users = this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.userService.search(term)
        // or the observable of all users if there was no search term
        : this.userService.search(''))
      .catch(() => {
        this.response = -1;
        return Observable.of<User[]>([]);
      });
    this.users = this.users.merge(this.deleteSubject)
      .startWith([])
      .scan((acc: any, val: any) => {
        if (val.op && val.op === 'delete') {
          let index = acc.findIndex((elt: any) => elt.id === val.id);
          acc.splice(index, 1);
          return acc;
        } else {
          return val;
        }
      });
  }
}
