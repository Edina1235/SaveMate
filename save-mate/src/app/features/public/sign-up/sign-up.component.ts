import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppUrl } from 'src/app/core/enums/app-url.enum';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  public signUpForm = new FormGroup({
    lastName: new FormControl(''),
    firstName: new FormControl(''),
    nickName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  });

  constructor(private router: Router) {}

  public onClickSignUp() {
    this.router.navigateByUrl(AppUrl.Home);
  }

  public onClickLogin() {
    this.router.navigateByUrl(AppUrl.Login);
  }

  private get firstName() {
    return this.signUpForm.get('firstName')?.value;
  }

  private get lastName() {
    return this.signUpForm.get('lastName')?.value;
  }

  private get nickName() {
    return this.signUpForm.get('nickName')?.value;
  }

  private get email() {
    return this.signUpForm.get('email')?.value;
  }

  private get password() {
    return this.signUpForm.get('password')?.value;
  }

  private get confirmPassword() {
    return this.signUpForm.get('confirmPassword')?.value;
  }
}
