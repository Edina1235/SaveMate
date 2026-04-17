import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AppUrl } from 'src/app/core/enums/app-url.enum';
import { SpendingCategoriesIcon } from 'src/app/core/enums/spending-categories-icon.enum';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { DebtInput } from 'src/app/core/models/debt-input';
import { Goal } from 'src/app/core/models/goal';
import { Income } from 'src/app/core/models/income';
import { SavedAmount } from 'src/app/core/models/saved-amont';
import { User } from 'src/app/core/models/user';
import { DebtService } from 'src/app/core/services/debt.service';
import { GoalService } from 'src/app/core/services/goal.service';
import { IncomeService } from 'src/app/core/services/income.service';
import { SavedAmountService } from 'src/app/core/services/saved-amount.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  public spendingCategoriesIcon = SpendingCategoriesIcon;
  public user?: User;
  public debts?: DebtInput[];
  public incomes?: Income[];
  public goals?: Goal[];
  public savedAmount: number = 0;

  ngOnInit(): void {
    this.afAuth.currentUser.then(user => {
      if(user) {
        const userId = user.uid;
        this.savedAmountService.getSavedAmountsByUserId(userId).subscribe({next: savedAmounts => {
          (savedAmounts as SavedAmount[]).forEach(savedAmount => {
            this.savedAmount += savedAmount.amount;
          });
        }, error: error => console.error(error)});
        this.userService.getUser(userId).subscribe({next: (user) => {
          this.user = user as User;
          this.debtService.getDebtsByUserId(this.user.id).subscribe({next: (debts) => {
            this.debts = debts as DebtInput[];
          }, error: error => console.error(error)});
          this.incomeService.getIncomesByUserId(this.user.id).subscribe({next: (incomes) => {
            this.incomes = incomes as Income[];
          }, error: error => console.error(error)});
          this.goalService.getGoalsByUserId(this.user.id).subscribe({next: (goals) => {
            this.goals = goals as Goal[];
          }, error: error => console.error(error)});
        }, error: error => console.error(error)});
      }
    });
  }

  constructor(private router: Router,
              private debtService: DebtService,
              private userService: UserService,
              private incomeService: IncomeService,
              private goalService: GoalService,
              private afAuth: AngularFireAuth,
              private savedAmountService: SavedAmountService) {}

  public onClickModification() {
    this.router.navigateByUrl(AppUrl.Settings);
  }

  public onClickDelete() {
    this.afAuth.currentUser.then(user => {
        if(user) {
          const userId = user.uid;
        this.userService.deleteUser(userId). subscribe({next: () => {
          user.delete();
          this.afAuth.signOut();
        }, error: error => console.error(error)});
      }
    });
  }

  public getFixSpendingCategoriesIcon(spendingCategoryName: SpendingCategoriesName) {
    switch (spendingCategoryName) {
      case SpendingCategoriesName.HousingAndUtilities:
        return this.spendingCategoriesIcon.HousingAndUtilities;
      case SpendingCategoriesName.Transportation:
        return this.spendingCategoriesIcon.Transportation; 
      case SpendingCategoriesName.FoodAndHousehold:
        return this.spendingCategoriesIcon.FoodAndHousehold;
      case SpendingCategoriesName.HealthAndPersonalExpenses:
        return this.spendingCategoriesIcon.HealthAndPersonalExpenses;
      case SpendingCategoriesName.ClothingAndOtherShopping:
        return this.spendingCategoriesIcon.ClothingAndOtherShopping;
      case SpendingCategoriesName.EntertainmentAndLeisure:
        return this.spendingCategoriesIcon.EntertainmentAndLeisure;
      case SpendingCategoriesName.ChildrenPerFamily:
        return this.spendingCategoriesIcon.ChildrenPerFamily;
      case SpendingCategoriesName.LoansAndDebts: 
        return this.spendingCategoriesIcon.LoansAndDebts;
      case SpendingCategoriesName.InsuranceAndFinancialProducts:
        return this.spendingCategoriesIcon.InsuranceAndFinancialProducts;
      case SpendingCategoriesName.SavingAndInvesting:
        return this.spendingCategoriesIcon.SavingAndInvesting;
      case SpendingCategoriesName.OtherPerVariableExpenses:
        return this.spendingCategoriesIcon.OtherPerVariableExpenses;
    }
  }
}