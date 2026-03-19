import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KnowledgeBase } from 'src/app/core/models/knowledge-base';

@Component({
  selector: 'app-knowledge-base-modify-dialog',
  templateUrl: './knowledge-base-modify-dialog.component.html',
  styleUrls: ['./knowledge-base-modify-dialog.component.scss']
})
export class KnowledgeBaseModifyDialogComponent {
  public formGroup: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required),
    resourceLink: new FormControl('', Validators.required),
  });

  constructor(private dialogRef: MatDialogRef<KnowledgeBaseModifyDialogComponent>,
              @Inject(MAT_DIALOG_DATA) 
              public data: KnowledgeBase) {}

  public onClickClose() {
    this.dialogRef.close();
  }

  public onClickSave() {
    //TODO save
    this.dialogRef.close();
  }
}
