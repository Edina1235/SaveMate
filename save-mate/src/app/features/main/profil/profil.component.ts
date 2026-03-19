import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppUrl } from 'src/app/core/enums/app-url.enum';
import { SpendingCategoriesIcon } from 'src/app/core/enums/spending-categories-icon.enum';
import { DebtInput } from 'src/app/core/models/debt-input';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent {
  public spendingCategoriesIcon = SpendingCategoriesIcon;
  public isNotificationEnabled: boolean = true;
  public debts: DebtInput[] = [
    {
      name: 'Hitel',
      totalAmount: 450000,
      monthlyPayment: 20000,
      interest: 3
    },
    {
      name: 'Hitel',
      totalAmount: 450000,
      monthlyPayment: 20000,
      interest: 3
    }
  ];

  constructor(private router: Router) {}

  public onClickModification() {
    this.router.navigateByUrl(AppUrl.Settings);
  }

  public onClickDelete() {
    //user törlése
  }
}
