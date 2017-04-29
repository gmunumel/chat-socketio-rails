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

  // add(name: string): void {
  //   name = name.trim();
  //   if (!name) { return; }
  //   this.heroService.create(name)
  //     .then(hero => {
  //       this.heroes.push(hero);
  //       this.selectedHero = null;
  //     });
  // }

  // delete(user: User): void {
  //   this.userService
  //               .delete(user)
  //               .then(() => {
  //                 this.heroes = this.heroes.filter(h => h !== hero);
  //                 if (this.selectedHero === hero) { this.selectedHero = null; }
  //               });
  // }
}
