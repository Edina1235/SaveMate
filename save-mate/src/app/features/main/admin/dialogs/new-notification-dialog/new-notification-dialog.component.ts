import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationCategory } from 'src/app/core/enums/notification-category.enum';

@Component({
  selector: 'app-new-notification-dialog',
  templateUrl: './new-notification-dialog.component.html',
  styleUrls: ['./new-notification-dialog.component.scss']
})
export class NewNotificationDialogComponent {
  public formGroup: FormGroup = new FormGroup({
    user: new FormControl('all', Validators.required),
    userId: new FormControl(''),
    title: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required),
    category: new FormControl(NotificationCategory.MonthlySummary, Validators.required),
  });

  public selectedCategory: NotificationCategory = NotificationCategory.MonthlySummary;

  public categories: NotificationCategory[] = Object.values(NotificationCategory).slice(1);

  constructor(private dialogRef: MatDialogRef<NewNotificationDialogComponent>) {}

  public onClickOption(i: number) {
    this.selectedCategory = this.categories[i];
  }

  public onClickClose() {
    this.dialogRef.close();
  }

  public onClickSave() {
    //TODO: save
    this.dialogRef.close();
  }

  public get user() {
    return this.formGroup.get('user')?.value;
  }
}
