import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Income } from 'src/app/core/models/income';
import { IncomeService } from 'src/app/core/services/income.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-adding-income',
  templateUrl: './adding-income.component.html',
  styleUrls: ['./adding-income.component.scss']
})
export class AddingIncomeComponent {
  public incomeGroup = new FormGroup({
    income: new FormControl('')
  });

  constructor(private dialogRef: MatDialogRef<AddingIncomeComponent>,
              private incomeService: IncomeService,
              private toastService: ToastService,
              private afAuth: AngularFireAuth
  ) {}

  public onClickClose() {
    this.dialogRef.close();
  }

  public onClickSave(): Promise<void> {
    return this.afAuth.currentUser.then(user => {
      const income: Income = {
        id: '',
        userId: user?.uid ?? '',
        amount: Number(this.income),
        date: new Date(),
        source: 'Fizetés'
      };

      this.incomeService.setIncome(income).subscribe({
        next: () => {
          this.toastService.successToastr('Siker', 'Sikeres mentés');
          this.dialogRef.close();
        },
        error: error => console.error(error)
      });
    });
  }

  public get income() {
    return this.incomeGroup.get('income')?.value;
  }
}
