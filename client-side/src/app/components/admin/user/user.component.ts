import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

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
  users: User[];

  constructor(
    private router: Router,
    private userService: UserService) { }

  getHeroes(): void {
    this.userService.getUsers().then(users => this.users = users);
  }

  ngOnInit(): void {
    this.getHeroes();
  }

  gotoDetail(user: User): void {
    this.router.navigate(['/admin/user/detail', user.id]);
  }

  add(): void {
    this.router.navigate(['/admin/user/detail', 0]);
  }

  delete(user: User): void {
    this.userService.delete(user.id)
                    .then(() => {
                      this.response = 1;
                      this.users = this.users.filter(u => u !== user);
                    })
                    .catch(() => {
                      this.response = -1;
                    });
  }
}
