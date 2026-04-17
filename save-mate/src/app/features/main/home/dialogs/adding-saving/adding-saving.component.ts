import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SavedAmount } from 'src/app/core/models/saved-amont';
import { SavedAmountService } from 'src/app/core/services/saved-amount.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-adding-saving',
  templateUrl: './adding-saving.component.html',
  styleUrls: ['./adding-saving.component.scss']
})
export class AddingSavingComponent {
  public savedAmountGroup = new FormGroup({
    savedAmount: new FormControl('')
  });

  constructor(private dialogRef: MatDialogRef<AddingSavingComponent>,
              private savedAmountService: SavedAmountService,
              private toastService: ToastService,
              private afAuth: AngularFireAuth
  ) {}

  public onClickClose() {
    this.dialogRef.close();
  }

  public onClickSave(): Promise<void> {
    return this.afAuth.currentUser.then(user => {
      const savedAmount: SavedAmount = {
        id: '',
        userId: user?.uid ?? '',
        amount: Number(this.savedAmount),
        date: new Date()
      };
      this.savedAmountService.setSavedAmount(savedAmount).subscribe({
        next: () => {
          this.toastService.successToastr('Siker', 'Sikeres mentés');
          this.dialogRef.close();
        },
        error: error => console.error(error)
      });
    });
  }

  public get savedAmount() {
    return this.savedAmountGroup.get('savedAmount')?.value;
  }
}
