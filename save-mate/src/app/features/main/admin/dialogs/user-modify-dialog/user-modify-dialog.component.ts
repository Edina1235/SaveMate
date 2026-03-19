import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role, User } from 'src/app/core/models/user';

@Component({
  selector: 'app-user-modify-dialog',
  templateUrl: './user-modify-dialog.component.html',
  styleUrls: ['./user-modify-dialog.component.scss']
})
export class UserModifyDialogComponent implements OnInit {
  public roles: Role[] = Object.values(Role);
  public formGroup: FormGroup = new FormGroup({
    role: new FormControl(Role.Admin, Validators.required)
  });

  constructor(private dialogRef: MatDialogRef<UserModifyDialogComponent>,
              @Inject(MAT_DIALOG_DATA) 
              private user: User) {}

  ngOnInit(): void {
      this.formGroup.get('role')?.setValue(this.user.role);
  }

  public onClickClose() {
    this.dialogRef.close();
  }

  public onClickSave() {
    //TODO: save
    this.dialogRef.close();
  }
}
