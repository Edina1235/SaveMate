import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppUrl } from 'src/app/core/enums/app-url.enum';
import { Role, User } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user.service';

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

  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              private userService: UserService
  ) {}

  public onClickSignUp() {
    this.signup(this.email, this.password).then(valami => {
      const user: User = {
        id: valami.user?.uid ?? "",
        email: this.email,
        firstname: this.firstName,
        lastname: this.lastName,
        nickname: this.userName,
        registrationDate: new Date(),
        lastLoginDate: new Date(),
        isGlobalNotificationsEnabled: true,
        topSpendingCategories: [],
        fixSpendingCategories: [],
        avgMonthlyFixedCosts: 0,
        role: Role.User,
        avatarId: null
      }
      this.userService.setUser(user).subscribe({error: error => console.error(error)});
      this.afAuth.signInWithEmailAndPassword(this.email, this.password).then(() => this.router.navigateByUrl(AppUrl.Questions));
    });
  }

  public signup(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  public onClickLogin() {
    this.router.navigateByUrl(AppUrl.Login);
  }

  private get firstName() {
    return this.signUpForm.get('firstName')?.value ?? '';
  }

  private get lastName() {
    return this.signUpForm.get('lastName')?.value ?? '';
  }

  private get userName() {
    return this.signUpForm.get('userName')?.value ?? '';
  }

  private get email() {
    return this.signUpForm.get('email')?.value ?? '';
  }

  private get password() {
    return this.signUpForm.get('password')?.value ?? '';
  }

  private get confirmPassword() {
    return this.signUpForm.get('confirmPassword')?.value ?? '';
  }
}
