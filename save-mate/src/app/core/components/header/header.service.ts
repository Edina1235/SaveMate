import { Injectable } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { User } from '../../models/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Notification } from '../../models/notification';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  public user?: User;
  public user$: Subject<User | undefined> = new Subject<User | undefined>();
  public notifications: Notification[] = [];

  constructor(private userService: UserService,
              private notificationService: NotificationService,
              private afAuth: AngularFireAuth) { }

  public loadUserData(): void {
    this.afAuth.currentUser.then(user => {
      if (user) {
        const userId = user.uid;
        this.userService.getUser(userId).subscribe({next: (user) => {
          this.user = user as User;
          this.user$.next(this.user);
          this.loadNotifications();
        }, error: error => {
          console.error(error);
        }});
      }
    });
  }

  public loadNotifications(): void {
    if (this.user) {
      this.notificationService.getNotificationsByUserId(this.user.id).subscribe({next: (notifications) => {
        this.notifications = notifications as Notification[];
      }, error: error => {
        console.error(error);
      }});
    }
  }
}
