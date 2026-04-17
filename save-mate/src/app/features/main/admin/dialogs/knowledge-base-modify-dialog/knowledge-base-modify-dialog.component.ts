import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KnowledgeBase } from 'src/app/core/models/knowledge-base';
import { KnowledgeBaseService } from 'src/app/core/services/knowledge-base.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-knowledge-base-modify-dialog',
  templateUrl: './knowledge-base-modify-dialog.component.html',
  styleUrls: ['./knowledge-base-modify-dialog.component.scss']
})
export class KnowledgeBaseModifyDialogComponent implements OnInit {
  public formGroup: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required),
    resourceLink: new FormControl('', Validators.required),
  });

  constructor(private dialogRef: MatDialogRef<KnowledgeBaseModifyDialogComponent>,
              @Inject(MAT_DIALOG_DATA) 
              public data: KnowledgeBase,
              private knowledgeBaseService: KnowledgeBaseService,
              private toastService: ToastService) {}

  ngOnInit(): void {
      this.formGroup.get('title')?.setValue(this.data.title);
      this.formGroup.get('text')?.setValue(this.data.text);
      this.formGroup.get('resourceLink')?.setValue(this.data.resourceLink);
  }

  public onClickClose() {
    this.dialogRef.close();
  }

  public onClickSave() {
    const knowledgeBase: KnowledgeBase = {
      id: this.data.id,
      title: this.formGroup.get('title')?.value,
      text: this.formGroup.get('text')?.value,
      resourceLink: this.formGroup.get('resourceLink')?.value,
      updateDate: new Date()
    };
    this.knowledgeBaseService.updateKnowledgeBase(this.data.id, knowledgeBase).subscribe({next: () => {
      this.toastService.successToastr("Siker", "Sikeres módosítás");
    }, error: error => console.error(error)});
    this.dialogRef.close();
  }
}
