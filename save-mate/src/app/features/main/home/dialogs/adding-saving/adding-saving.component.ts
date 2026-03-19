import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-adding-saving',
  templateUrl: './adding-saving.component.html',
  styleUrls: ['./adding-saving.component.scss']
})
export class AddingSavingComponent {
  public savedAmountGroup = new FormGroup({
    savedAmount: new FormControl('')
  });

  constructor(private dialogRef: MatDialogRef<AddingSavingComponent>) {}

  public onClickClose() {
    this.dialogRef.close();
  }

  public onClickSave() {}

  public get savedAmount() {
    return this.savedAmountGroup.get('savedAmount')?.value;
  }
}
