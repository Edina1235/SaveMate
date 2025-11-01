import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppUrl } from 'src/app/core/enums/app-url.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public loginForm = new FormGroup({
    emailOrUsername: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private router: Router) {}

  public onClickLogin() {
    this.router.navigateByUrl(AppUrl.Home);
  }

  public onClickSignUp() {
    this.router.navigateByUrl(AppUrl.SignUp);
  }

  private get emailOrUsername() {
    return this.loginForm.get('emailOrUsername')?.value;
  }

  private get password() {
    return this.loginForm.get('password')?.value;
  }
}
