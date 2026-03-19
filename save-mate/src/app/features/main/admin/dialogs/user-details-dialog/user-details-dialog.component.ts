import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-user-details-dialog',
  templateUrl: './user-details-dialog.component.html',
  styleUrls: ['./user-details-dialog.component.scss']
})
export class UserDetailsDialogComponent {

  constructor(private dialogRef: MatDialogRef<UserDetailsDialogComponent>,
                @Inject(MAT_DIALOG_DATA) 
                public user: User) {}

  public onClickClose() {
    this.dialogRef.close();
  }
}
