import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialogRef } from '@angular/material/dialog';
import { Debt } from 'src/app/core/models/debt';
import { DebtInput } from 'src/app/core/models/debt-input';
import { DebtService } from 'src/app/core/services/debt.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-add-debt',
  templateUrl: './add-debt.component.html',
  styleUrls: ['./add-debt.component.scss']
})
export class AddDebtComponent {
  public isValidGroup: boolean = false;
  public debtInputs: DebtInput[] = [];
  public debts: Debt[] = [];

  constructor(private dialogRef: MatDialogRef<AddDebtComponent>,
              private debtService: DebtService,
              private toastService: ToastService,
              private afAuth: AngularFireAuth
  ) {}

  public invalidChange(event: boolean) {
    this.isValidGroup = event;
  }

  public dataChange(event: DebtInput[]) {
    this.debtInputs = event;
  }

  public onClickClose() {
    this.dialogRef.close();
  }

  public async onClickSave(): Promise<void> {
    await this.getDebts();
    this.debts.forEach((debt, i) => {
      this.debtService.setDebt(debt).subscribe({next: () => {
        if(i === this.debts.length - 1) {
          this.toastService.successToastr('Siker', 'Sikeres mentés');
          this.dialogRef.close();
        }
      }, error: error => console.error(error)});
    });
  }

  private getDebts(): Promise<void> {
    this.debts = [];
    return this.afAuth.currentUser.then(user => {
      this.debtInputs.forEach(debtInput => {
        const debt: Debt = {
          id: '',
          userId: user?.uid ?? '',
          name: debtInput.name,
          totalAmount: debtInput.totalAmount,
          paidAmount: debtInput.paidAmount,
          monthlyPayment: debtInput.monthlyPayment,
          interest: debtInput.interest,
          dueDate: new Date(),
          hasArrears: false,
          prepaymentAllowed: false
        };
        this.debts.push(debt);
      });
    });
  }
}
