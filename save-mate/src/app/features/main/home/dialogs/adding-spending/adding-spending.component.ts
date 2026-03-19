import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-adding-spending',
  templateUrl: './adding-spending.component.html',
  styleUrls: ['./adding-spending.component.scss']
})
export class AddingSpendingComponent {

  constructor(private dialogRef: MatDialogRef<AddingSpendingComponent>) {}

  public onClickClose() {
    this.dialogRef.close();
  }

  public onClickSave() {}
}
