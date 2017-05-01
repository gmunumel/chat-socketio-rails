import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User }        from '../../models/user';
import { UserService } from '../../services/user.service';

const emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  providers: [ UserService ]
})
export class SignUpComponent {
  page: string = 'Sign Up';
  response: number = 0;
  user: User;
  signUpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService) {

    this.signUpForm = this.fb.group({
      id: [-1],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
    });
  }

  doSignUp(): void {
    this.user = new User();
    Object.assign(this.user, this.signUpForm.value);

    this.userService.create(this.user)
      .then(user => {
        this.response = 1;
      })
      .catch((error: any) => {
        return (error.status === 409) ? this.response = -2 : this.response = -1;
      });
  }
}
