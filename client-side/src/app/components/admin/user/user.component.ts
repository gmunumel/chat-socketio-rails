import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { User }        from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: [ '../../../app/css/styles.css' ]
})
export class UserComponent implements OnInit {
  page: string = 'Admin User';
  response: number = 0;
  users: Observable<User[]>;
  private searchTerms = new Subject<string>();

  searchTerm$ = this.searchTerms.asObservable().startWith('');

  constructor(
    private router: Router,
    private userService: UserService) { }

  getUsers(): Observable<User[]> {
    //this.userService.getUsers().then(users => this.users = users);
    this.users = this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.userService.search(term)
        // or the observable of all users if there was no search term
        : this.userService.search(''))
      .catch(() => {
        // TODO: add real error handling
        //console.log(error);
        this.response = -1;
        return Observable.of<User[]>([]);
      });
    return this.users;
  }

  ngOnInit(): void {
    this.getUsers();
    console.log(this.searchTerm$);
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
          // TODO
          // this.users = this.users.filter(us => us.filter(u => u !== user));
        })
        .catch(() => {
          this.response = -1;
        });
  }
}
