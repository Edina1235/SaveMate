import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-adding-fixed-spend',
  templateUrl: './adding-fixed-spend.component.html',
  styleUrls: ['./adding-fixed-spend.component.scss']
})
export class AddingFixedSpendComponent {

  constructor(private dialogRef: MatDialogRef<AddingFixedSpendComponent>) {}

  public onClickClose() {
    this.dialogRef.close();
  }

  public onClickSave() {}
}
