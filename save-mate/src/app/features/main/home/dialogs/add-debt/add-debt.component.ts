import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-debt',
  templateUrl: './add-debt.component.html',
  styleUrls: ['./add-debt.component.scss']
})
export class AddDebtComponent {

  constructor(private dialogRef: MatDialogRef<AddDebtComponent>) {}

  public onClickClose() {
    this.dialogRef.close();
  }

  public onClickSave() {}
}
