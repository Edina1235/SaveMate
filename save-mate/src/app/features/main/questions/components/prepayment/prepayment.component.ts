import { Component } from '@angular/core';
import { Debt } from 'src/app/core/models/debt';
import { Router } from '@angular/router';
import { AppUrl } from 'src/app/core/enums/app-url.enum';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-prepayment',
  templateUrl: './prepayment.component.html',
  styleUrls: ['./prepayment.component.scss']
})
export class PrepaymentComponent {
  public debts: Debt[] = [
    {id: '1', userId: '1', name: 'haz', totalAmount: 100, monthlyPayment: 10, interest: 3, dueDate: new Date()},
    {id: '1', userId: '1', name: 'haz', totalAmount: 100, monthlyPayment: 10, interest: 3, dueDate: new Date()},
    {id: '1', userId: '1', name: 'haz', totalAmount: 100, monthlyPayment: 10, interest: 3, dueDate: new Date()},
    {id: '1', userId: '1', name: 'haz', totalAmount: 100, monthlyPayment: 10, interest: 3, dueDate: new Date()},
    {id: '1', userId: '1', name: 'haz', totalAmount: 100, monthlyPayment: 10, interest: 3, dueDate: new Date()}
  ];

  public debtsGroup: FormGroup = new FormGroup({});

  constructor(private router: Router) {
    this.fillFormGroup();
    console.log(this.debtsGroup);
  }

  private fillFormGroup() {
      let index = 0;
      this.debts.forEach(debt => {
        this.debtsGroup.addControl('debt'+index, new FormControl(false));
        index++;
      });
    }

  public onClickFinish() {
    this.router.navigateByUrl(AppUrl.Home);
  }
}
