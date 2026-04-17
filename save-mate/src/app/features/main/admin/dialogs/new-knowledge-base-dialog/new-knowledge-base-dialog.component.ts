import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { KnowledgeBase } from 'src/app/core/models/knowledge-base';
import { KnowledgeBaseService } from 'src/app/core/services/knowledge-base.service';
import { ToastService } from 'src/app/core/services/toast.service';

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

  constructor(private dialogRef: MatDialogRef<NewKnowledgeBaseDialogComponent>,
              private knowledgeBaseService: KnowledgeBaseService,
              private toastService: ToastService
  ) {}

  public onClickClose() {
    this.dialogRef.close();
  }

  public onClickSave() {
    const knowledgeBase: KnowledgeBase = {
      id: '',
      title: this.formGroup.get('title')?.value,
      text: this.formGroup.get('text')?.value,
      resourceLink: this.formGroup.get('resourceLink')?.value,
      updateDate: new Date()
    }
    this.knowledgeBaseService.setKnowledgeBase(knowledgeBase).subscribe({next: () => {
      this.toastService.successToastr("Siker", "Sikeres létrehozás");
    }, error: error => console.error(error)});
    this.dialogRef.close();
  }
}
