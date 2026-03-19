import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-knowledge-base-dialog',
  templateUrl: './new-knowledge-base-dialog.component.html',
  styleUrls: ['./new-knowledge-base-dialog.component.scss']
})
export class NewKnowledgeBaseDialogComponent {
  public formGroup: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required),
    resourceLink: new FormControl('', Validators.required),
  });

  constructor(private dialogRef: MatDialogRef<NewKnowledgeBaseDialogComponent>) {}

  public onClickClose() {
    this.dialogRef.close();
  }

  public onClickSave() {
    //TODO save
    this.dialogRef.close();
  }
}
