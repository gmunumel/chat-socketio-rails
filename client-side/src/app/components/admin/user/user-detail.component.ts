import { Component, Input, OnInit } from '@angular/core';
import { Router }                   from '@angular/router';
import {
  FormGroup, FormBuilder, Validators
}                                   from '@angular/forms';
import { ActivatedRoute, Params }   from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { User }        from '../../../models/user';
import { UserService } from '../../../services/user.service';

const emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

@Component({
  selector: 'user-detail',
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
    this.route.params
      .switchMap((params: Params) => this.userService.getUser(+params['id']))
      .subscribe(user => this.userDetailForm.patchValue(user) );
  }

  save(): void {
    let user = new User();
    user.id = this.userDetailForm.value.id;
    user.name = this.userDetailForm.value.name;
    user.email = this.userDetailForm.value.email;

    this.userService.update(user)
      .then(() => {
        this.response = 1;
        this.goBack();
      })
      .catch(() => {
        this.response = -1;
      });
  }

  goBack(): void {
    this.router.navigate(['/admin/user']);
  }
}
