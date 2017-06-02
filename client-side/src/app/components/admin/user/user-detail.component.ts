import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute }       from '@angular/router';
import {
  FormGroup, FormBuilder, Validators
}                                   from '@angular/forms';

import { Subscription }  from 'rxjs/Subscription';

import { User }           from '../../../models/user';
import { UserService }    from '../../../services/user.service';
import { SessionService } from '../../../services/session.service';

const emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

@Component({
  selector: 'admin-user-detail',
  templateUrl: './user-detail.component.html',
  providers: [ SessionService ]
})
export class UserDetailComponent implements OnInit, OnDestroy {
  page: string = 'Admin User Detail';
  response: number = 0;
  userDetailForm: FormGroup;
  private paramsSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) {

    this.userDetailForm = this.fb.group({
      id: [-1],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
    });
  }

  ngOnInit(): void {
    if (!SessionService.getInstance().isLoggedIn()) {
      this.router.navigate(['signin']);
    }

    this.paramsSubscription = this.route.params
      .subscribe(p => this.getUser(+p['id']));
  }

  save(): void {
    let user = new User();
    Object.assign(user, this.userDetailForm.value);

    this.saveOrUpdate(user);
  }

  goBack(): void {
    this.router.navigate(['/admin/user']);
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.paramsSubscription.unsubscribe();
  }

  private getUser(id: number): void {
    // when id===-1, create new user
    if (id === -1) {
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

  private saveOrUpdate(user: User): void {
    if (user.id === -1) {
      this.userService.create(user)
        .then(() => {
          this.response = 1; // It will be lost
          this.goBack();
        })
        .catch((error: any) => {
          return (error.status === 409) ? this.response = -2 : this.response = -1;
        });
    } else {
        this.userService.update(user)
          .then(() => {
            this.response = 1; // It will be lost
            this.goBack();
          })
          .catch((error: any) => {
            return (error.status === 409) ? this.response = -2 : this.response = -1;
          });
    }
  }
}
