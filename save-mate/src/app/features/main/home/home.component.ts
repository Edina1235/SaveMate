import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { SpendingByCategory } from 'src/app/core/models/spending-by-category';
import * as echarts from 'echarts';
import { CategoryToReduce } from 'src/app/core/models/category-to-reduce';
import { SpendingCategoriesIcon } from 'src/app/core/enums/spending-categories-icon.enum';
import { ThousandSpacePipe } from 'src/app/shared/pipe/thousand-space.pipe';
import { MatDialog } from '@angular/material/dialog';
import { AddDebtComponent } from './dialogs/add-debt/add-debt.component';
import { AddingSavingComponent } from './dialogs/adding-saving/adding-saving.component';
import { AddingSpendingComponent } from './dialogs/adding-spending/adding-spending.component';
import { DebtService } from 'src/app/core/services/debt.service';
import { Debt } from 'src/app/core/models/debt';
import { ExpenseService } from 'src/app/core/services/expense.service';
import { RecurringExpenseService } from 'src/app/core/services/recurring-expense.service';
import { forkJoin } from 'rxjs';
import { Expense } from 'src/app/core/models/expense';
import { RecurringExpense } from 'src/app/core/models/recurring-expense';
import { IncomeService } from 'src/app/core/services/income.service';
import { SavedAmountService } from 'src/app/core/services/saved-amount.service';
import { SavedAmount } from 'src/app/core/models/saved-amont';
import { Income } from 'src/app/core/models/income';
import { AddingIncomeComponent } from './dialogs/adding-income/adding-income.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ThousandSpacePipe]
})
export class HomeComponent implements OnInit, AfterViewInit {
  public spendingByCategory: SpendingByCategory[] = [
    {
      category: SpendingCategoriesName.ChildrenPerFamily,
      amount: 0
    },
    {
      category: SpendingCategoriesName.ClothingAndOtherShopping,
      amount: 0
    },
    {
      category: SpendingCategoriesName.FoodAndHousehold,
      amount: 0
    },
    {
      category: SpendingCategoriesName.HealthAndPersonalExpenses,
      amount: 0
    },
    {
      category: SpendingCategoriesName.OtherPerVariableExpenses,
      amount: 0
    },
    {
      category: SpendingCategoriesName.LoansAndDebts,
      amount: 0
    },
    {
      category: SpendingCategoriesName.HousingAndUtilities,
      amount: 0
    },
    {
      category: SpendingCategoriesName.EntertainmentAndLeisure,
      amount: 0
    },
    {
      category: SpendingCategoriesName.InsuranceAndFinancialProducts,
      amount: 0
    }, {
      category: SpendingCategoriesName.SavingAndInvesting,
      amount: 0
    },
    {
      category: SpendingCategoriesName.Transportation,
      amount: 0
    }
  ];

  public currentIncome: number = 0;
  public totalIncome: number = 0;

  public currentSaving: number = 0;
  public totalSaving: number = 0;

  public currentFixSpending: number = 0;
  public totalFixSpending: number = 0;

  public categoriesToReduce: CategoryToReduce[] = [];

 @HostListener('window:resize')
  onResize() {
    if(window.innerWidth <= 660) {
      this.chartInstance?.setOption({ 
        legend: {
          left: '50%',
          formatter: (name: string) => {
            const max = 20;
            if (name.length > max) {
              return name.slice(0, max) + '\n' + name.slice(max);
            }
            return name;
          }
        },
        series: [{
          label: {
            fontSize: 12,
          },
          center: ['25%', '50%'],
          radius: ['30%', '45%']
        }]
      });
      this.chartInstanceDebt?.setOption({
      legend: {
        right: '5%',
      },
      graphic: {
        left: '20%',
        style: {
          width: 50,
          height: 35
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['28%', '50%'],
        }
      ]
    });
    } else {
      this.initializeCharts();
    }
    
    requestAnimationFrame(() => {
      this.chartInstance?.resize();
      this.chartInstanceDebt?.resize();
    });
  }

  @ViewChild('chart', { static: false }) chartElement?: ElementRef;
  @ViewChild('chartDebt', { static: false }) chartElementDebt?: ElementRef;
  private chartInstance?: echarts.ECharts;
  private chartOptions?: echarts.EChartsOption;
  private chartInstanceDebt?: echarts.ECharts;
  private chartOptionsDebt?: echarts.EChartsOption;
  private colors: string[] = [];

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit(): void {
    if(this.chartElement && this.chartElementDebt) {
      this.chartInstance = echarts.init(this.chartElement.nativeElement);
      this.chartInstanceDebt = echarts.init(this.chartElementDebt.nativeElement);
      this.initializeCharts();
    }
    this.onResize();
  }

  constructor(private thousandPipe: ThousandSpacePipe,
              private dialog: MatDialog,
              private debtService: DebtService,
              private expenseService: ExpenseService,
              private recurringExpenseService: RecurringExpenseService,
              private incomeService: IncomeService,
              private savedAmountService: SavedAmountService,
            private afAuth: AngularFireAuth) {}

  public onClickOpenDebtDialog() {
    this.dialog.open(AddDebtComponent, {
      autoFocus: false
    });
  }

  public onClickOpenFixedSpendDialog() {
    this.dialog.open(AddingSpendingComponent, {
      autoFocus: false,
      data: "Fix költés hozzáadása"
    });
  }

  public onClickOpenAddingSavingDialog() {
    this.dialog.open(AddingSavingComponent, {
      autoFocus: false
    });
  }

  public onClickOpenAddingSpendingDialog() {
    this.dialog.open(AddingSpendingComponent, {
      autoFocus: false,
      data: "Költés hozzáadása"
    });
  }

  public onClickOpenAddingIncomeDialog() {
    this.dialog.open(AddingIncomeComponent, {
      autoFocus: false
    });
  }

  private initializeCharts() { 
    if(this.chartInstance && this.chartInstanceDebt) {
      this.getChartData();
      this.getChartDataDebt();
    }    
  }
  private setOption(chartData: any) {
    this.chartOptions = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        right: '5%',
        top: 'center',
        orient: 'vertical'
      },
      grid: {
        containLabel: true
      },
      series: [
        {
          type: 'pie',
          radius: ['60%', '90%'],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            borderRadius: 10
          },
          color: this.colors,
          label: {
            show: true,
            position: 'center',
            fontSize: 18,
            color: '#346B69',
            formatter: () => {
              const total = this.spendingByCategory.reduce((sum, item) => sum + item.amount, 0);
              return `${this.thousandPipe.transform(total)} Ft`;
            }
          },
          emphasis: {
            label: {
              show: false
            }
          },
          labelLine: {
            show: false
          },
          center: ['20%', '50%'],
          data: chartData
        }
      ]
    } as echarts.EChartsOption;
    this.chartInstance?.setOption(this.chartOptions);
  }

  private getChartData() {
    this.spendingByCategory = [
      {
        category: SpendingCategoriesName.ChildrenPerFamily,
        amount: 0
      },
      {
        category: SpendingCategoriesName.ClothingAndOtherShopping,
        amount: 0
      },
      {
        category: SpendingCategoriesName.FoodAndHousehold,
        amount: 0
      },
      {
        category: SpendingCategoriesName.HealthAndPersonalExpenses,
        amount: 0
      },
      {
        category: SpendingCategoriesName.OtherPerVariableExpenses,
        amount: 0
      },
      {
        category: SpendingCategoriesName.LoansAndDebts,
        amount: 0
      },
      {
        category: SpendingCategoriesName.HousingAndUtilities,
        amount: 0
      },
      {
        category: SpendingCategoriesName.EntertainmentAndLeisure,
        amount: 0
      },
      {
        category: SpendingCategoriesName.InsuranceAndFinancialProducts,
        amount: 0
      }, {
        category: SpendingCategoriesName.SavingAndInvesting,
        amount: 0
      },
      {
        category: SpendingCategoriesName.Transportation,
        amount: 0
      }
    ];
    const currentUser = this.afAuth.currentUser;
    if (!currentUser) {
      return;
    }

    currentUser.then(user => {
      const userId = user?.uid;
      if (userId) {
        forkJoin({
          expenses: this.expenseService.getExpensesByUserId(userId),
          recurringExpenses: this.recurringExpenseService.getRecurringExpensesByUserId(userId)
        }).subscribe({ next: ({expenses, recurringExpenses}) => {
        let total = 0;
        [...(expenses as Expense[]), ...(recurringExpenses as RecurringExpense[])].forEach(expense => {
          this.spendingByCategory.find(spending => spending.category === expense.category)!.amount += expense.amount;
          total += expense.amount;
        });
        
        const chartData: { value: number; name: SpendingCategoriesName; }[] = [];
        this.spendingByCategory.forEach(data => {
          if(data.amount !== 0) {
            chartData.push({
              value: data.amount,
              name: data.category
            });
            this.colors.push(this.getColorToCategory(data.category));
          }
        });
        this.setCategoriesToReduce(total);
        this.setOption(chartData);
      }, error: error => console.error(error)});
    }
    });
  }

  private setCategoriesToReduce(total: number) {
    this.categoriesToReduce = [];
    this.spendingByCategory.forEach(spendingByCategory => {
      this.categoriesToReduce.push({category: this.getSpendingIconByName(spendingByCategory.category), percent: Math.floor(this.getPercent(total, spendingByCategory.amount))});
    });
    
    this.categoriesToReduce.sort((a,b) => {
      if(a.percent < b.percent) return 1;
      else if (a.percent > b.percent) return -1;
      return 0;
    });
    this.categoriesToReduce = this.categoriesToReduce.filter(c => c.percent !== 0);
    if(this.categoriesToReduce.length > 4)
      this.categoriesToReduce = this.categoriesToReduce.slice(0,4);
  }

  private getPercent(all: number, current: number) {
    return (current * 100) / all;
  }

  private getSpendingIconByName(name: SpendingCategoriesName): SpendingCategoriesIcon {
    switch(name) {
      case SpendingCategoriesName.ChildrenPerFamily:
        return SpendingCategoriesIcon.ChildrenPerFamily;
      case SpendingCategoriesName.ClothingAndOtherShopping:
        return SpendingCategoriesIcon.ClothingAndOtherShopping;
      case SpendingCategoriesName.EntertainmentAndLeisure:
        return SpendingCategoriesIcon.EntertainmentAndLeisure;
      case SpendingCategoriesName.FoodAndHousehold:
        return SpendingCategoriesIcon.FoodAndHousehold;
      case SpendingCategoriesName.HealthAndPersonalExpenses:
        return SpendingCategoriesIcon.HealthAndPersonalExpenses;
      case SpendingCategoriesName.HousingAndUtilities:
        return SpendingCategoriesIcon.HousingAndUtilities;
      case SpendingCategoriesName.InsuranceAndFinancialProducts:
        return SpendingCategoriesIcon.InsuranceAndFinancialProducts;
      case SpendingCategoriesName.LoansAndDebts:
        return SpendingCategoriesIcon.LoansAndDebts;
      case SpendingCategoriesName.OtherPerVariableExpenses:
        return SpendingCategoriesIcon.OtherPerVariableExpenses;
      case SpendingCategoriesName.SavingAndInvesting:
        return SpendingCategoriesIcon.SavingAndInvesting;
      case SpendingCategoriesName.Transportation:
        return SpendingCategoriesIcon.Transportation;
    }
  }

  private setOptionDebt(chartData: any) {
    this.chartOptionsDebt = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        right: '15%',
        top: 'center',
        orient: 'vertical'
      },
      graphic: {
        type: 'image',
        left: '27%',
        top: 'center',
        style: {
          image: '/assets/money-bills.svg',
          width: 70,
          height: 50
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['60%', '90%'],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            borderRadius: 10
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: false
            }
          },
          labelLine: {
            show: false
          },
          color: ['#0072B2', 'rgba(0,0,0,0.2)'],
          center: ['35%', '50%'],
          data: chartData
        }
      ]
    } as echarts.EChartsOption;
    this.chartInstanceDebt?.setOption(this.chartOptionsDebt);
  }

  private getChartDataDebt() {
    const currentUser = this.afAuth.currentUser;
    if (!currentUser) {
      return;
    }

    currentUser.then(user => {
      const userId = user?.uid;
      if (userId) {
        this.debtService.getDebtsByUserId(userId).subscribe({next: debts => {
      let left = 0;
      let paid = 0;
      (debts as Debt[]).forEach(debt => {
        left += debt.totalAmount - debt.paidAmount;
        paid = debt.paidAmount;
      });
      const chartData = [
        {value: paid, name: 'Kifizetve'},
        {value: left, name: 'Fennmaradt'}
      ];
      this.setOptionDebt(chartData);
    }, error: error => console.error(error)});
    }});
  }

  private getColorToCategory(category: SpendingCategoriesName) {
    switch(category) {
      case SpendingCategoriesName.HousingAndUtilities:
        return '#B5C8EA';
      case SpendingCategoriesName.Transportation:
        return '#F0A3B4';
      case SpendingCategoriesName.FoodAndHousehold:
        return '#CC79A7';
      case SpendingCategoriesName.HealthAndPersonalExpenses:
        return '#8F3985';
      case SpendingCategoriesName.ClothingAndOtherShopping:
        return '#56B4E9';
      case SpendingCategoriesName.EntertainmentAndLeisure:
        return '#0072B2';
      case SpendingCategoriesName.ChildrenPerFamily:
        return '#F0E442';
      case SpendingCategoriesName.LoansAndDebts:
        return '#E69F00';
      case SpendingCategoriesName.InsuranceAndFinancialProducts:
        return '#D55E00';
      case SpendingCategoriesName.SavingAndInvesting:
        return '#009E73';
      case SpendingCategoriesName.OtherPerVariableExpenses:
        return '#7A9E7E';
    }
  }

  private getData() {
    const currentUser = this.afAuth.currentUser;
    if (!currentUser) {
      return;
    }

    currentUser.then(user => {
      const userId = user?.uid;
      if (userId) {
        forkJoin({
        recurringExpenses: this.recurringExpenseService.getRecurringExpensesByUserId(userId),
        savedAmounts: this.savedAmountService.getSavedAmountsByUserId(userId),
        incomes: this.incomeService.getIncomesByUserId(userId)
      }).subscribe({next: ({recurringExpenses, savedAmounts, incomes}) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        (recurringExpenses as RecurringExpense[]).forEach(recurringExpense => {
          const expenseYear = (new Date(recurringExpense.date)).getFullYear();
          const expenseMonth = (new Date(recurringExpense.date)).getMonth();
          this.totalFixSpending += recurringExpense.amount;
          if(year === expenseYear && month === expenseMonth) {
            this.currentFixSpending += recurringExpense.amount;
          }
        });

        (savedAmounts as SavedAmount[]).forEach(savedAmount => {
          const savedYear = (new Date(savedAmount.date)).getFullYear();
          const savedMonth = (new Date(savedAmount.date)).getMonth();
          this.totalSaving += savedAmount.amount;
          if(year === savedYear && month === savedMonth) {
            this.currentSaving += savedAmount.amount;
          }
        });

        (incomes as Income[]).forEach(income => {
          const incomeYear = (new Date(income.date)).getFullYear();
          const incomeMonth = (new Date(income.date)).getMonth();
          this.totalIncome += income.amount;
          if(year === incomeYear && month === incomeMonth) {
            this.currentIncome += income.amount;
          }
        });
      }, error: error => console.error(error)});
    }
    });
  }
}
