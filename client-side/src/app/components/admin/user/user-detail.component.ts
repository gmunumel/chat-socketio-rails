import { Component, OnInit }        from '@angular/core';
import { Router }                   from '@angular/router';
import {
  FormGroup, FormBuilder, Validators
}                                   from '@angular/forms';
import { ActivatedRoute }           from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { User }        from '../../../models/user';
import { UserService } from '../../../services/user.service';

const emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

@Component({
  selector: 'admin-user-detail',
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit {
  page: string = 'Admin User Detail';
  response: number = 0;
  userDetailForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) {

    this.userDetailForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(p => this.getUser(+p['id']));
  }

  save(): void {
    let user = new User();
    Object.assign(user, this.userDetailForm.value);

    this.saveOrUpdate(user);
  }

  goBack(): void {
    this.router.navigate(['/admin/user']);
  }

  private getUser(id: number): void {
    // when id===0, create new user
    if (id === 0) {
      return;
    }

    this.userService.getUser(id)
      .then(user => {
        this.userDetailForm.patchValue(user);
      })
      .catch(() => {
        this.goBack();
      });
  }

  private saveOrUpdate(user: User) {
    if (user.id === 0) {
      this.userService.create(user)
        .then(() => {
          this.response = 1; // It will be lost
          this.goBack();
        })
        .catch(() => {
          this.response = -1;
        });
     } else {
      this.userService.update(user)
        .then(() => {
          this.response = 1; // It will be lost
          this.goBack();
        })
        .catch(() => {
          this.response = -1;
        });
    }
  }
}
