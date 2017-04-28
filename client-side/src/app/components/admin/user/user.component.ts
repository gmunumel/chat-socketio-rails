import { Component, OnInit } from '@angular/core';

import { User }        from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: [ '../../../app/css/styles.css' ]
})
export class UserComponent implements OnInit {
  page: string = 'Admin User';
  users: User[];
  selectedHero: User;

  constructor(private userService: UserService) { }

  getHeroes(): void {
    this.userService.getUsers().then(users => this.users = users);
  }

  ngOnInit(): void {
    this.getHeroes();
  }
}
