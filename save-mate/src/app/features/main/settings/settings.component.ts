import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { HeaderService } from 'src/app/core/components/header/header.service';
import { AvatarImageName } from 'src/app/core/enums/avatar-image-name.enum';
import { Goals } from 'src/app/core/enums/goals.enum';
import { NotificationCategory } from 'src/app/core/enums/notification-category.enum';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { Alert, AlertCondition } from 'src/app/core/models/alert';
import { Debt } from 'src/app/core/models/debt';
import { DebtInput } from 'src/app/core/models/debt-input';
import { Goal } from 'src/app/core/models/goal';
import { Income } from 'src/app/core/models/income';
import { SavedAmount } from 'src/app/core/models/saved-amont';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { DebtService } from 'src/app/core/services/debt.service';
import { GoalService } from 'src/app/core/services/goal.service';
import { IncomeService } from 'src/app/core/services/income.service';
import { NotificationSchedulerService } from 'src/app/core/services/notification-scheduler.service';
import { SavedAmountService } from 'src/app/core/services/saved-amount.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public avatarImgs: AvatarImageName[] = Object.values(AvatarImageName);
  public selectedAvatar: AvatarImageName | null = null;
  public categories = Object.values(NotificationCategory);
  public types = Object.values(AlertCondition);
  public goals = Object.values(Goals);

  public debts: DebtInput[] = [];
  public debtValidGroup: boolean = false;
  public alertIndexes: number[] = [];
  public isGlobalNotificationEnabled: boolean = true;
  public isGoalLoaded: boolean = false;
  public selectedFixSpendingCategories: SpendingCategoriesName[] = [];

  private lastIncome?: Income;
  private lastGoal?: Goal;
  private alerts: Alert[] = [];
  private realDebts: Debt[] = [];

  public userFormGroup: FormGroup = new FormGroup({
    lastname: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  public paymentFormGroup: FormGroup = new FormGroup({
    income: new FormControl('', Validators.required),
    saving: new FormControl('', Validators.required),
    fixPayment: new FormControl('', Validators.required)
  });

  public alertFormGroup: FormGroup = new FormGroup({
    category_0: new FormControl(this.categories[0], Validators.required),
    type_0: new FormControl(this.types[0], Validators.required),
    value_0: new FormControl('', [Validators.required, Validators.min(1)]),
    title_0: new FormControl('', [Validators.required, Validators.min(4)]),
    text_0: new FormControl('', [Validators.required, Validators.min(4)]),
    isEnabled_0: new FormControl(false, Validators.required)
  });

  public goalFormGroup: FormGroup = new FormGroup({
    other: new FormControl(false),
    otherName: new FormControl(''),
    amount: new FormControl('', Validators.required),
    years: new FormControl('', Validators.required)
  });

  constructor(private headerService: HeaderService,
              private incomeService: IncomeService,
              private goalService: GoalService,
              private debtService: DebtService,
              private alertService: AlertService,
              private userService: UserService,
              private savedAmountService: SavedAmountService,
              private notificationSchedulerService: NotificationSchedulerService,
              private toastService: ToastService) {}

  ngOnInit(): void {
    this.headerService.user$.pipe(take(1)).subscribe({next: user => {
      if(user) {
        this.userFormGroup.patchValue({
          lastname: user.lastname,
          firstname: user.firstname,
          username: user.nickname,
          email: user.email
        });
        this.selectedAvatar = user.avatarId ? (user.avatarId as AvatarImageName) : null;
        this.isGlobalNotificationEnabled = user.isGlobalNotificationsEnabled;
        this.selectedFixSpendingCategories = user.fixSpendingCategories;
        this.paymentFormGroup.patchValue({
          fixPayment: user.avgMonthlyFixedCosts
        });
        this.incomeService.getIncomesByUserId(user.id).subscribe({next: (incomes) => {
          this.lastIncome = (incomes as Income[])[(incomes as Income[]).length - 1];
          this.paymentFormGroup.patchValue({
            income: (incomes as Income[])[(incomes as Income[]).length - 1].amount
          });
        }, error: error => console.error(error)});
        this.savedAmountService.getSavedAmountsByUserId(user.id).subscribe({next: savedAmounts => {
          let amount = 0;
          (savedAmounts as SavedAmount[]).forEach(savedAmount => {
            amount += savedAmount.amount;
          });

          this.paymentFormGroup.patchValue({
            saving: amount
          });
        }, error: error => console.error(error)});
        this.goalService.getGoalsByUserId(user.id).subscribe({next:(goals) => {
          const goal = (goals as Goal[])[0];
          this.lastGoal = goal;
          this.goals.forEach((goalEnum, i) => {
            if(goal.target.includes(goalEnum)) {
              this.goalFormGroup.addControl('goal' + i, new FormControl(true));
            } else {
              this.goalFormGroup.addControl('goal' + i, new FormControl(false));
            }
          });
          this.goalFormGroup.patchValue({
            years: Math.round((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 365)),
            amount: goal.targetAmount
          });
          const vanKulonbseg = goal.target.some(x => !this.goals.includes(x as Goals));
          const kulonbseg = goal.target.filter(x => !this.goals.includes(x as Goals));
          
          if(vanKulonbseg) {
            kulonbseg.forEach(goal => {
              this.goalFormGroup.patchValue({
                other: true,
                otherName: goal
              });
            });
          }
          this.isGoalLoaded = true;
        }, error: error => console.error(error)});
        this.debtService.getDebtsByUserId(user.id).subscribe({next:(debts) => {
          this.debts = debts as DebtInput[];
          this.realDebts = debts as Debt[];
        }, error: error => console.error(error)});
        this.alertService.getAlertByUserId(user.id).subscribe({next:(alerts) => {
          if(alerts) {
            const realAlerts = alerts as Alert[];
            this.alerts = realAlerts;
            this.alertFormGroup = new FormGroup({});
            realAlerts.forEach(alert => {
              let lastIndex;
              if(this.alertIndexes.length === 0) {
                lastIndex = 0;
              } else {
                lastIndex = this.alertIndexes[this.alertIndexes.length-1] + 1;
              }
              this.alertIndexes.push(lastIndex);
              this.alertFormGroup.addControl('category_' + lastIndex, new FormControl(alert.type, Validators.required));
              this.alertFormGroup.addControl('type_' + lastIndex, new FormControl(alert.condition, Validators.required)); 
              this.alertFormGroup.addControl('value_' + lastIndex, new FormControl(alert.conditionValue, [Validators.required, Validators.min(1)]));
              this.alertFormGroup.addControl('title_' + lastIndex, new FormControl(alert.title, [Validators.required, Validators.min(4)]));
              this.alertFormGroup.addControl('text_' + lastIndex, new FormControl(alert.text, [Validators.required, Validators.min(4)]));
              this.alertFormGroup.addControl('isEnabled_' + lastIndex, new FormControl(alert.isEnabled, Validators.required));
            });
          }
        }, error: error => console.error(error)}); 
      }
    }, error: error => console.error(error)});
    
      if(this.user) {
        this.userFormGroup.patchValue({
          lastname: this.user.lastname,
          firstname: this.user.firstname,
          username: this.user.nickname,
          email: this.user.email
        });
        this.selectedAvatar = this.user.avatarId ? (this.user.avatarId as AvatarImageName) : null;
        this.isGlobalNotificationEnabled = this.user.isGlobalNotificationsEnabled;
        this.selectedFixSpendingCategories = this.user.fixSpendingCategories;
        this.paymentFormGroup.patchValue({
          fixPayment: this.user.avgMonthlyFixedCosts
        });
        this.incomeService.getIncomesByUserId(this.user.id).subscribe({next:(incomes) => {
          this.lastIncome = (incomes as Income[])[(incomes as Income[]).length - 1];
          this.paymentFormGroup.patchValue({
            income: (incomes as Income[])[(incomes as Income[]).length - 1].amount
          });
        }, error: error => console.error(error)});
        this.savedAmountService.getSavedAmountsByUserId(this.user.id).subscribe({next: savedAmounts => {
          let amount = 0;
          (savedAmounts as SavedAmount[]).forEach(savedAmount => {
            amount += savedAmount.amount;
          });

          this.paymentFormGroup.patchValue({
            saving: amount
          });
        }, error: error => console.error(error)});
        this.goalService.getGoalsByUserId(this.user.id).subscribe({next:(goals) => {
          const goal = (goals as Goal[])[0];
          this.lastGoal = goal;
          this.goals.forEach((goalEnum, i) => {
            if(goal.target.includes(goalEnum)) {
              this.goalFormGroup.addControl('goal' + i, new FormControl(true));
            } else {
              this.goalFormGroup.addControl('goal' + i, new FormControl(false));
            }
          });
          this.goalFormGroup.patchValue({
            years: Math.round((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 365)),
            amount: goal.targetAmount
          });
          const vanKulonbseg = goal.target.some(x => !this.goals.includes(x as Goals));
          const kulonbseg = goal.target.filter(x => !this.goals.includes(x as Goals));
          
          if(vanKulonbseg) {
            kulonbseg.forEach(goal => {
              this.goalFormGroup.patchValue({
                other: true,
                otherName: goal
              });
            });
          }
          this.isGoalLoaded = true;
        }, error: error => console.error(error)});
        this.debtService.getDebtsByUserId(this.user.id).subscribe({next:(debts) => {
          this.debts = debts as DebtInput[];
          this.realDebts = debts as Debt[];
        }, error: error => console.error(error)});
        this.alertService.getAlertByUserId(this.user.id).subscribe({next:(alerts) => {
          if(alerts) {
            const realAlerts = alerts as Alert[];
            this.alerts = realAlerts;
            this.alertFormGroup = new FormGroup({});
            realAlerts.forEach(alert => {
              let lastIndex;
              if(this.alertIndexes.length === 0) {
                lastIndex = 0;
              } else {
                lastIndex = this.alertIndexes[this.alertIndexes.length-1] + 1;
              }
              this.alertIndexes.push(lastIndex);
              this.alertFormGroup.addControl('category_' + lastIndex, new FormControl(alert.type, Validators.required));
              this.alertFormGroup.addControl('type_' + lastIndex, new FormControl(alert.condition, Validators.required)); 
              this.alertFormGroup.addControl('value_' + lastIndex, new FormControl(alert.conditionValue, [Validators.required, Validators.min(1)]));
              this.alertFormGroup.addControl('title_' + lastIndex, new FormControl(alert.title, [Validators.required, Validators.min(4)]));
              this.alertFormGroup.addControl('text_' + lastIndex, new FormControl(alert.text, [Validators.required, Validators.min(4)]));
              this.alertFormGroup.addControl('isEnabled_' + lastIndex, new FormControl(alert.isEnabled, Validators.required));
            });
          }
        }, error: error => console.error(error)}); 
      }
  }

  public onClickOption(alertIndex: number, categoryIndex: number) {
    const category = this.categories[categoryIndex];
    this.alertFormGroup.patchValue({
      ['category_'+alertIndex]: category
    });
  }

  public onClickTypeOption(alertIndex: number, typeIndex: number) {
    const type = this.types[typeIndex];
    this.alertFormGroup.patchValue({
      ['type_'+alertIndex]: type
    });
  }

  public onClickNewRow() {
    const lastNumber = this.alertIndexes[this.alertIndexes.length-1] ?? 0;
    const index = lastNumber + 1; 
    this.alertIndexes.push(index);
    this.alertFormGroup.addControl('category_' + index, new FormControl('', Validators.required));
    this.alertFormGroup.addControl('type_' + index, new FormControl('', Validators.required)); 
    this.alertFormGroup.addControl('value_' + index, new FormControl('', Validators.required));
    this.alertFormGroup.addControl('title_' + index, new FormControl('', Validators.required));
    this.alertFormGroup.addControl('text_' + index, new FormControl('', Validators.required));
    this.alertFormGroup.addControl('isEnabled_' + index, new FormControl(false, Validators.required));
  }

  public onClickDelete(alertIndex: number) {
    this.alertIndexes = this.alertIndexes.filter(index => index !== alertIndex);
    this.removeControlsById(this.alertFormGroup, alertIndex);
  }

  private removeControlsById(form: FormGroup, id: number): void {
    Object.keys(form.controls)
      .filter(key => key.endsWith(`_${id}`))
      .forEach(key => form.removeControl(key));
  }

  public getSelectedCategory(alertIndex: number) {
    return this.alertFormGroup.get('category_'+alertIndex)?.value || 'Kategória';
  }

  public getSelectedType(alertIndex: number) {
    return this.alertFormGroup.get('type_'+alertIndex)?.value || 'Típus';
  }

  public onClickAvatar(avatar: AvatarImageName) {
    this.selectedAvatar = avatar;
  }

  public onClickMonogram() {
    this.selectedAvatar = null;
  }

  public setDebtsInput(debts: DebtInput[]) {
    this.debts = debts;
  }

  public setDebtValidGroup(valid: boolean) {
    this.debtValidGroup = valid;
  }

  public onClickSave() {
    this.updateUser();
    this.updatePayment();
    this.updateGoals();
    this.updateAlerts();
    this.updateDebts();
  }

  public onChangeActiveCategories(activeCategories: SpendingCategoriesName[]
  ) {
    this.selectedFixSpendingCategories = activeCategories;
  }

  private updateUser() {
    const user: User = {
      ...this.headerService.user!,
      avatarId: this.selectedAvatar,
      lastname: this.userFormGroup.get('lastname')?.value,
      firstname: this.userFormGroup.get('firstname')?.value,
      nickname: this.userFormGroup.get('username')?.value,
      email: this.userFormGroup.get('email')?.value,
      isGlobalNotificationsEnabled: this.isGlobalNotificationEnabled,
      avgMonthlyFixedCosts: this.paymentFormGroup.get('fixPayment')?.value,
      fixSpendingCategories: this.selectedFixSpendingCategories
    }
    this.userService.updateUser(user.id, user).subscribe({next:() => {
      this.headerService.loadUserData();
    }, error: error => console.error(error)});
  }

  private updatePayment() {
    const income: Income = {
      ...this.lastIncome!,
      amount: this.paymentFormGroup.get('income')?.value
    }
    this.incomeService.updateIncome(income.id, income).subscribe({error: error => console.error(error)});
  }

  private updateGoals() {
    const goal: Goal = {
      ...this.lastGoal!,
      targetAmount: this.goalFormGroup.get('amount')?.value,
      deadline: new Date(new Date().getTime() + (this.goalFormGroup.get('years')?.value * 365 * 24 * 60 * 60 * 1000)),
      target: []
    }  
    this.goals.forEach((goalEnum, i) => {
      if(this.goalFormGroup.get('goal' + i)?.value) {
        goal.target.push(goalEnum);
      }
    });
    this.goalService.updateGoal(goal.id, goal).subscribe({error: error => console.error(error)});
  }

  private updateAlerts() {
    if(this.alertIndexes.length !== 0) {
      this.alerts.forEach((alert, i) => {
        if(this.alertIndexes.includes(i)) {
          const updatedAlert: Alert = {
            ...alert,
            type: this.alertFormGroup.get('category_' + i)?.value,
            condition: this.alertFormGroup.get('type_' + i)?.value,
            conditionValue: this.alertFormGroup.get('value_' + i)?.value,
            title: this.alertFormGroup.get('title_' + i)?.value,
            text: this.alertFormGroup.get('text_' + i)?.value,
            isEnabled: this.alertFormGroup.get('isEnabled_' + i)?.value
          }
          this.alertService.updateAlert(alert.id, updatedAlert).subscribe({next:() => {
            this.notificationSchedulerService.initNotification(this.headerService.user!.lastLoginDate, updatedAlert, this.headerService.user!.id);
          }, error: error => console.error(error)});
        } else {
          this.alertService.deleteAlert(alert.id).subscribe({error: error => console.error(error)});
        }
      });
      if(this.alertIndexes.length > this.alerts.length) {
        this.alertIndexes.forEach(index => {
          if(index >= this.alerts.length) { 
            const newAlert: Alert = {
              id: '',
              userId: this.headerService.user!.id,
              type: this.alertFormGroup.get('category_' + index)?.value,
              condition: this.alertFormGroup.get('type_' + index)?.value,
              conditionValue: this.alertFormGroup.get('value_' + index)?.value,
              title: this.alertFormGroup.get('title_' + index)?.value,
              text: this.alertFormGroup.get('text_' + index)?.value,
              isEnabled: this.alertFormGroup.get('isEnabled_' + index)?.value,
              createdAt: new Date(),
            }
            this.alertService.setAlert(newAlert).subscribe({next:() => {
              this.notificationSchedulerService.initNotification(this.headerService.user!.lastLoginDate, newAlert, this.headerService.user!.id);
            }, error: error => console.error(error)});
          }
        });
      }
    }
  }

  private updateDebts() {
    this.realDebts.forEach((debt, i) => {
      if(this.debts[i]) {
        const updatedDebt: Debt = { 
          ...debt,
          name: this.debts[i].name,
          totalAmount: this.debts[i].totalAmount,
          monthlyPayment: this.debts[i].monthlyPayment,
          paidAmount: this.debts[i].paidAmount,
          interest: this.debts[i].interest
        }
        this.debtService.updateDebt(debt.id, updatedDebt).subscribe({next:() => {
          if(i === this.realDebts.length - 1 && this.realDebts.length >= this.debts.length) {
            this.toastService.successToastr("Siker", "Változtatások sikeresen elmentve!");
          }
        }, error: error => console.error(error)});
      } else {
        this.debtService.deleteDebt(debt.id).subscribe({next:() => {
          if(i === this.realDebts.length - 1 && this.realDebts.length >= this.debts.length) {
            this.toastService.successToastr("Siker", "Változtatások sikeresen elmentve!");
          }
        }, error: error => console.error(error)});
      }
    });

    if(this.debts.length > this.realDebts.length) {
      this.debts.forEach((debt, i) => {
        if(i >= this.realDebts.length) {
          const newDebt: Debt = {
            id: '',
            userId: this.headerService.user!.id,
            name: debt.name,
            totalAmount: debt.totalAmount,
            paidAmount: debt.paidAmount,
            monthlyPayment: debt.monthlyPayment,
            interest: debt.interest,
            dueDate: new Date(),
            hasArrears: false,
            prepaymentAllowed: false
          }
          this.debtService.setDebt(newDebt).subscribe({next: () => {
            if(i === this.debts.length - 1) {
              this.toastService.successToastr("Siker", "Változtatások sikeresen elmentve!");  
            }
          }, error: error => console.error(error)});
        }
      });
    }
  }

  public get user() {
    return this.headerService.user;
  }
}
