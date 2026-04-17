import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationCategory } from 'src/app/core/enums/notification-category.enum';
import { Notification } from 'src/app/core/models/notification';
import { User } from 'src/app/core/models/user';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-new-notification-dialog',
  templateUrl: './new-notification-dialog.component.html',
  styleUrls: ['./new-notification-dialog.component.scss']
})
export class NewNotificationDialogComponent {
  public formGroup: FormGroup = new FormGroup({
    user: new FormControl('all', Validators.required),
    email: new FormControl(''),
    title: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required),
    category: new FormControl(NotificationCategory.MonthlySummary, Validators.required),
  });

  public selectedCategory: NotificationCategory = NotificationCategory.MonthlySummary;

  public categories: NotificationCategory[] = Object.values(NotificationCategory).slice(1);

  constructor(private dialogRef: MatDialogRef<NewNotificationDialogComponent>,
              private notificationService: NotificationService,
              private userService: UserService,
              private toastService: ToastService
  ) {}

  public onClickOption(i: number) {
    this.selectedCategory = this.categories[i];
  }

  public onClickClose() {
    this.dialogRef.close();
  }

  public onClickSave() {
    this.userService.getUsers().subscribe({next: (users) => {
      const selectedUsers = this.formGroup.get("user")?.value;
      if(selectedUsers === "all") {
        (users as User[]).forEach(user => {
          const notification: Notification = {
            id: "",
            userId: user.id,
            title: this.formGroup.get("title")?.value,
            text: this.formGroup.get("text")?.value,
            category: this.formGroup.get("category")?.value,
            createdAt: new Date(),
            isRead: false
          };
          this.notificationService.setNotification(notification).subscribe({next: () => {
            if((users as User[])[(users as User[]).length-1].id === user.id) {
              this.toastService.successToastr("Siker", "Sikeres létrehozás");
              this.dialogRef.close();
            }
          }, error: error => console.error(error)});
        });
      } else {
        const emails = this.formGroup.get("email")?.value.slice(',');
        const filteredUsers = (users as User[]).filter(user => emails.includes(user.email));
        filteredUsers.forEach(user => {
          const notification: Notification = {
            id: "",
            userId: user.id,
            title: this.formGroup.get("title")?.value,
            text: this.formGroup.get("text")?.value,
            category: this.formGroup.get("category")?.value,
            createdAt: new Date(),
            isRead: false
          };
          this.notificationService.setNotification(notification).subscribe({next: () => {
            if(filteredUsers[filteredUsers.length-1].id === user.id) {
              this.toastService.successToastr("Siker", "Sikeres létrehozás");
              this.dialogRef.close();
            }
          }, error: error => console.error(error)});
        });
      }
    }, error: error => console.error(error)});
  }

  public get user() {
    return this.formGroup.get('user')?.value;
  }
}
