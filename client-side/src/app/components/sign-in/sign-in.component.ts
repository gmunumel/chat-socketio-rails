import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User }        from '../../models/user';
import { UserService } from '../../services/user.service';

const emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  providers: [ UserService ]
})
export class SignInComponent {
  page: string = 'Sign In';
  response: number = 0;
  user: User;
  signInForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService) {

    this.signInForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
    });
  }

  doSignIn(): void {
    this.user = new User();
    this.user.name = this.signInForm.value.name;
    this.user.email = this.signInForm.value.email;

    this.userService.search(this.user)
      .then(user => {
        this.response = 1;
        localStorage.userName = user.name;
        localStorage.userEmail = user.email;
      })
      .catch(user => {
        this.response = -1;
      });
  }
}
