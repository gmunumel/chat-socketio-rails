import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

const emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  providers: [UserService]
})
export class SignUpComponent {
  page: string = 'Sign Up';
  response: number = 0;
  private user: User;

  public signUpForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(emailRegex)]],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService) {}

  doSignUp(): void {
    this.user = new User();
    this.user.name = this.signUpForm.value.name;
    this.user.email = this.signUpForm.value.email;

    this.userService.create(this.user)
      .then(user => {
        this.response = 1;
      })
      .catch(user => {
        this.response = -1;
      });
  }
}
