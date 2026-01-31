import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppUrl } from 'src/app/core/enums/app-url.enum';

export function matchValidator(
  matchTo: string, 
  reverse?: boolean
): ValidatorFn {
  return (control: AbstractControl): 
  ValidationErrors | null => {
    if (control.parent && reverse) {
      const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
      if (c) {
        c.updateValueAndValidity();
      }
      return null;
    }
    return !!control.parent &&
      !!control.parent.value &&
      control.value === 
      (control.parent?.controls as any)[matchTo].value
      ? null
      : { matching: true };
  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  public signUpForm = new FormGroup({
    lastName: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    userName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]),
    confirmPassword: new FormControl('', [Validators.required, matchValidator('password')])
  });

  constructor(private router: Router) {}

  public onClickSignUp() {
    this.router.navigateByUrl(AppUrl.Questions);
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

  private get userName() {
    return this.signUpForm.get('userName')?.value;
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
