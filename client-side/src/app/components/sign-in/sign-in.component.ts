import { Component }                          from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User }            from '../../models/user';
import { SessionService }  from '../../services/session.service';
import { UserService }     from '../../services/user.service';

const emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  providers: [ SessionService ]
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
      id: [-1],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
    });
  }

  doSignIn(): void {
    if (SessionService.getInstance().isLoggedIn()) {
      return;
    }
    this.user = new User();
    Object.assign(this.user, this.signInForm.value);

    this.userService.fetch(this.user)
      .then((user) => {
        this.response = 1;
        SessionService.getInstance().setUserId(user.id.toString());
        SessionService.getInstance().setUserName(user.name);
        SessionService.getInstance().setUserEmail(user.email);
      })
      .catch(() => {
        this.response = -1;
      });
  }
}
