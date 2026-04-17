import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppUrl } from 'src/app/core/enums/app-url.enum';
import { Alert } from 'src/app/core/models/alert';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { NotificationSchedulerService } from 'src/app/core/services/notification-scheduler.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public loginForm = new FormGroup({
    emailOrUsername: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(25)])
  });

  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              private notificationSchedulerService: NotificationSchedulerService,
              private alertService: AlertService,
              private userService: UserService
  ) {}

  public onClickLogin() {
    this.login(this.emailOrUsername, this.password).then(valami => {
      forkJoin({
        alerts: this.alertService.getAlertByUserId(valami.user!.uid),
        user: this.userService.getUser(valami.user!.uid)
      }).subscribe({next: ({alerts, user}) => {
        (alerts as Alert[]).forEach(alert => {
          if((alert as Alert).isEnabled)
            this.notificationSchedulerService.initNotification((user as User).lastLoginDate, alert, (user as User).id);
        });
        (user as User).lastLoginDate = new Date();
        this.userService.updateUser((user as User).id, user as User);
        this.router.navigateByUrl(AppUrl.Home);
      }, error: error => console.error(error)});
    });
  }

  private login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  public onClickSignUp() {
    this.router.navigateByUrl(AppUrl.SignUp);
  }

  private get emailOrUsername() {
    return this.loginForm.get('emailOrUsername')?.value ?? '';
  }

  private get password() {
    return this.loginForm.get('password')?.value ?? '';
  }
}
