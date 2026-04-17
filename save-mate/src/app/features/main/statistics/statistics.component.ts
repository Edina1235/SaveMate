import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { SpendingByIcon } from './models/spending-by-icon';
import { SpendingCategoriesIcon } from 'src/app/core/enums/spending-categories-icon.enum';
import { SpendingCategoriesColor } from 'src/app/core/enums/spending-categories-color.enum';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from './dialogs/info-dialog/info-dialog.component';
import { ExpenseService } from 'src/app/core/services/expense.service';
import { RecurringExpenseService } from 'src/app/core/services/recurring-expense.service';
import { SavedAmountService } from 'src/app/core/services/saved-amount.service';
import { HeaderService } from 'src/app/core/components/header/header.service';
import { RecurringExpense } from 'src/app/core/models/recurring-expense';
import { Expense } from 'src/app/core/models/expense';
import { SavedAmount } from 'src/app/core/models/saved-amont';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { forkJoin } from 'rxjs';
import { IncomeService } from 'src/app/core/services/income.service';
import { Income } from 'src/app/core/models/income';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('lineChart', { static: false }) lineChartElement?: ElementRef;
  @ViewChild('barChart', { static: false }) barChartElement?: ElementRef;
  private lineChartInstance?: echarts.ECharts;
  private lineChartOption?: echarts.EChartsOption;
  private barChartInstance?: echarts.ECharts;
  private barChartOption?: echarts.EChartsOption;

  private recurringExpenses: RecurringExpense[] = [];
  private expenses: Expense[] = [];
  private savedAmounts: SavedAmount[] = [];

  public spendingByIcons: SpendingByIcon[] = [];

  public spending: number[] = [];
  public saving: number[] = [];
  public months: string[] = [];
  public products: string [][] = [];
  public incomes: Income[] = [];

  constructor(private dialog: MatDialog,
              private expenseService: ExpenseService,
              private recurringExpenseService: RecurringExpenseService,
              private savedAmountService: SavedAmountService,
              private headerService: HeaderService,
              private incomeService: IncomeService
  ) {}

  ngOnInit(): void {
    this.headerService.user$.subscribe({next: user => {
      if(user) {
        forkJoin({
          recurringExpenses: this.recurringExpenseService.getRecurringExpensesByUserId(user.id),
          expenses: this.expenseService.getExpensesByUserId(user.id),
          savedAmounts: this.savedAmountService.getSavedAmountsByUserId(user.id),
          incomes: this.incomeService.getIncomesByUserId(user.id)
        }).subscribe({next: ({recurringExpenses, expenses, savedAmounts, incomes}) => {
          this.recurringExpenses = (recurringExpenses as RecurringExpense[]);
          this.recurringExpenses.filter(recurringExpense => (new Date(recurringExpense.date)).getFullYear() === (new Date()).getFullYear());

          this.expenses = expenses as Expense[];
          this.expenses.filter(expense => (new Date(expense.date)).getFullYear() === (new Date()).getFullYear());
          
          this.savedAmounts = savedAmounts as SavedAmount[];
          this.savedAmounts.filter(savedAmount => (new Date(savedAmount.date)).getFullYear() === (new Date()).getFullYear());

          this.incomes = incomes as Income[];
          this.incomes.filter(income => (new Date(income.date)).getFullYear() === (new Date()).getFullYear());

          this.setData();
          this.getProduct();

          if(this.lineChartElement && this.barChartElement) {
            this.lineChartInstance = echarts.init(this.lineChartElement.nativeElement);
            this.barChartInstance = echarts.init(this.barChartElement.nativeElement);
            this.setLineChartOption();
            this.setBarChartOption();
            if(this.lineChartOption && this.barChartOption) {
              this.lineChartInstance.setOption(this.lineChartOption);
              this.barChartInstance.setOption(this.barChartOption);
              this.onResize();
            }
          }
        }, error: error => console.error(error)});
      }
    }, error: error => console.error(error)});
    if(this.headerService.user) {
      forkJoin({
        recurringExpenses: this.recurringExpenseService.getRecurringExpensesByUserId(this.headerService.user.id),
        expenses: this.expenseService.getExpensesByUserId(this.headerService.user.id),
        savedAmounts: this.savedAmountService.getSavedAmountsByUserId(this.headerService.user.id),
        incomes: this.incomeService.getIncomesByUserId(this.headerService.user.id)
      }).subscribe({next: ({recurringExpenses, expenses, savedAmounts, incomes}) => {
        this.recurringExpenses = (recurringExpenses as RecurringExpense[]);
        this.recurringExpenses.filter(recurringExpense => (new Date(recurringExpense.date)).getFullYear() === (new Date()).getFullYear());

        this.expenses = expenses as Expense[];
        this.expenses.filter(expense => (new Date(expense.date)).getFullYear() === (new Date()).getFullYear());
        
        this.savedAmounts = savedAmounts as SavedAmount[];
        this.savedAmounts.filter(savedAmount => (new Date(savedAmount.date)).getFullYear() === (new Date()).getFullYear());

        this.incomes = incomes as Income[];
        this.incomes.filter(income => (new Date(income.date)).getFullYear() === (new Date()).getFullYear());

        this.setData();
        this.getProduct();

        if(this.lineChartElement && this.barChartElement) {
          this.lineChartInstance = echarts.init(this.lineChartElement.nativeElement);
          this.barChartInstance = echarts.init(this.barChartElement.nativeElement);
          this.setLineChartOption();
          this.setBarChartOption();
          if(this.lineChartOption && this.barChartOption) {
            this.lineChartInstance.setOption(this.lineChartOption);
            this.barChartInstance.setOption(this.barChartOption);
            this.onResize();
          }
        }
      }, error: error => console.error(error)});
    }
  }

  ngOnDestroy(): void {
      if (this.lineChartElement) {
        this.lineChartInstance?.dispose();
      }
      if (this.barChartElement) {
        this.barChartInstance?.dispose();
      }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if(this.lineChartElement && this.barChartElement) {
        this.lineChartInstance = echarts.init(this.lineChartElement.nativeElement);
        this.barChartInstance = echarts.init(this.barChartElement.nativeElement);
        this.setLineChartOption();
        this.setBarChartOption();
        if(this.lineChartOption && this.barChartOption) {
          this.lineChartInstance.setOption(this.lineChartOption);
          this.barChartInstance.setOption(this.barChartOption);
          this.onResize();
        }
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    if(window.innerWidth <= 660) {
      this.lineChartInstance?.setOption({
        legend: {
          right: 'auto',
          top: 'auto',
          left: 'center',
          bottom: '2%',
          orient: 'horizontal',
          padding: 0
        },
        grid: {
          right: '5%',
          bottom: '25%'
        },
      });

      this.barChartInstance?.setOption({
        legend: {
          right: 'auto',
          top: 'auto',
          left: 'center',
          bottom: '2%',
          orient: 'horizontal',
          padding: 0
        },
        grid: {
          right: '5%',
          bottom: '25%'
        },
      });
    } else {
      this.lineChartInstance?.setOption({
        legend: {
          right: '2%',
          top: 'center',
          orient: 'vertical'
        },
        grid: {
          right: '20%',
          bottom: '5%'
        },
      });

      this.barChartInstance?.setOption({
        legend: {
          right: '2%',
          top: 'center',
          orient: 'vertical'
        },
        grid: {
          right: '20%',
          bottom: '5%'
        },
      });
    }
    requestAnimationFrame(() => {
      this.lineChartInstance?.resize();
      this.barChartInstance?.resize();
    });
  }

  public onClickInfo() {
    this.dialog.open(InfoDialogComponent);
  }

  private setLineChartOption() {
    this.lineChartOption = {
      legend: {
        data: ['Költések', 'Megtakarítás'],
        right: '2%',
        top: 'center',
        orient: 'vertical'
      },
      grid: {
        right: '20%',
        left: '10%',
        top: '15%',
        bottom: '5%'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: this.months
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Költések',
          data: this.spending,
          type: 'line'
        },
        {
          name: 'Megtakarítás',
          data: this.saving,
          type: 'line'
        }
      ]
    };
  }

  private setBarChartOption() {
    this.barChartOption = {
      legend: {
        right: '2%',
        top: 'center',
        orient: 'vertical'
      },
      grid: {
        right: '20%',
        left: '10%',
        top: '15%',
        bottom: '5%'
      },
      tooltip: {},
      dataset: {
        source: this.products
      },
      xAxis: { type: 'category' },
      yAxis: { max: 100 },
      series: [
        {
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => {
              const value = Math.round(Number(params.value[params.seriesIndex + 1]));

              if (value > 50) {
                return `{red|${value}%}`;
              } else if (value === 50) {
                return `{orange|${value}%}`;
              } else {
                return `{green|${value}%}`;
              }
            },
            rich: {
              green: { color: 'green', fontWeight: 'bold' },
              orange: { color: 'orange', fontWeight: 'bold' },
              red: { color: 'red', fontWeight: 'bold' }
            },
          }
        },
        {
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => {
              const value = Math.round(Number(params.value[params.seriesIndex + 1]));

              if (value > 30) {
                return `{red|${value}%}`;
              } else if (value === 30) {
                return `{orange|${value}%}`;
              } else {
                return `{green|${value}%}`;
              }
            },
            rich: {
              green: { color: 'green', fontWeight: 'bold' },
              orange: { color: 'orange', fontWeight: 'bold' },
              red: { color: 'red', fontWeight: 'bold' }
            },
          }
        },
        {
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => {
              const value = Math.round(Number(params.value[params.seriesIndex + 1]));

              if (value < 20) {
                return `{red|${value}%}`;
              } else if (value === 20) {
                return `{orange|${value}%}`;
              } else {
                return `{green|${value}%}`;
              }
            },
            rich: {
              green: { color: 'green', fontWeight: 'bold' },
              orange: { color: 'orange', fontWeight: 'bold' },
              red: { color: 'red', fontWeight: 'bold' }
            },
          }
        }
      ]
    };
  }

  private getProduct() {
    this.products.push(['product', 'Fix költség', 'Szórakozás', 'Megtakarítás']);

    let january: number = 0;
    let february: number = 0;
    let march: number = 0;
    let april: number = 0;
    let may: number = 0;
    let june: number = 0;
    let july: number = 0;
    let august: number = 0;
    let sept: number = 0;
    let oct: number = 0;
    let nov: number = 0;
    let dec: number = 0;

    this.recurringExpenses.forEach(recurringExpense => {
      switch((new Date(recurringExpense.date)).getMonth()) {
        case 0:
          january += recurringExpense.amount;
          break;
        case 1:
          february += recurringExpense.amount;
          break;
        case 2:
          march += recurringExpense.amount;
          break;
        case 3:
          april += recurringExpense.amount;
          break;
        case 4:
          may += recurringExpense.amount;
          break;
        case 5:
          june += recurringExpense.amount;
          break;
        case 6:
          july += recurringExpense.amount;
          break;
        case 7:
          august += recurringExpense.amount;
          break;
        case 8:
          sept += recurringExpense.amount;
          break;
        case 9:
          oct += recurringExpense.amount;
          break;
        case 10:
          nov += recurringExpense.amount;
          break;
        case 11:
          dec += recurringExpense.amount;
          break;
      }
    });

    let januaryex: number = 0;
    let februaryex: number = 0;
    let marchex: number = 0;
    let aprilex: number = 0;
    let mayex: number = 0;
    let juneex: number = 0;
    let julyex: number = 0;
    let augustex: number = 0;
    let septex: number = 0;
    let octex: number = 0;
    let novex: number = 0;
    let decex: number = 0;

    this.expenses.forEach(expense => {
      switch((new Date(expense.date)).getMonth()) {
        case 0:
          januaryex += expense.amount;
          break;
        case 1:
          februaryex += expense.amount;
          break;
        case 2:
          marchex += expense.amount;
          break;
        case 3:
          aprilex += expense.amount;
          break;
        case 4:
          mayex += expense.amount;
          break;
        case 5:
          juneex += expense.amount;
          break;
        case 6:
          julyex += expense.amount;
          break;
        case 7:
          augustex += expense.amount;
          break;
        case 8:
          septex += expense.amount;
          break;
        case 9:
          octex += expense.amount;
          break;
        case 10:
          novex += expense.amount;
          break;
        case 11:
          decex += expense.amount;
          break;
      }
    });

    let januarys: number = 0;
    let februarys: number = 0;
    let marchs: number = 0;
    let aprils: number = 0;
    let mays: number = 0;
    let junes: number = 0;
    let julys: number = 0;
    let augusts: number = 0;
    let septs: number = 0;
    let octs: number = 0;
    let novs: number = 0;
    let decs: number = 0;

    this.savedAmounts.forEach(savedAmount => {
      switch((new Date(savedAmount.date)).getMonth()) {
        case 0:
          januarys += savedAmount.amount;
          break;
        case 1:
          februarys += savedAmount.amount;
          break;
        case 2:
          marchs += savedAmount.amount;
          break;
        case 3:
          aprils += savedAmount.amount;
          break;
        case 4:
          mays += savedAmount.amount;
          break;
        case 5:
          junes += savedAmount.amount;
          break;
        case 6:
          julys += savedAmount.amount;
          break;
        case 7:
          augusts += savedAmount.amount;
          break;
        case 8:
          septs += savedAmount.amount;
          break;
        case 9:
          octs += savedAmount.amount;
          break;
        case 10:
          novs += savedAmount.amount;
          break;
        case 11:
          decs += savedAmount.amount;
          break;
      }
    });

    if(january !== 0 || januaryex !== 0 || januarys !== 0) {
      const income = this.incomes.filter(income => (new Date(income.date)).getMonth() === 0);
      const all = income.length !== 0 ? income[0].amount : (this.incomes.length !== 0 ? this.incomes[this.incomes.length-1].amount : 0);
      this.products.push(['Jan', String(this.getPercent(all, january)), String(this.getPercent(all, januaryex)), String(this.getPercent(all, januarys))]);
      this.spending.push(january + januaryex);
      this.saving.push(januarys);
      this.months.push('Jan');
    }

    if(february !== 0 || februaryex !== 0 || februarys !== 0) {
      const income = this.incomes.filter(income => (new Date(income.date)).getMonth() === 1);
      const all = income.length !== 0 ? income[0].amount : (this.incomes.length !== 0 ? this.incomes[this.incomes.length-1].amount : 0);
      this.products.push(['Febr', String(this.getPercent(all, february)), String(this.getPercent(all, februaryex)), String(this.getPercent(all, februarys))]);
      this.spending.push(february + februaryex);
      this.saving.push(februarys);
      this.months.push('Febr');
    }

    if(march !== 0 || marchex !== 0 || marchs !== 0) {
      const income = this.incomes.filter(income => (new Date(income.date)).getMonth() === 2);
      const all = income.length !== 0 ? income[0].amount : (this.incomes.length !== 0 ? this.incomes[this.incomes.length-1].amount : 0);
      this.products.push(['Márc', String(this.getPercent(all, march)), String(this.getPercent(all, marchex)), String(this.getPercent(all, marchs))]);
      this.spending.push(march + marchex);
      this.saving.push(marchs);
      this.months.push('Márc');
    }

    if(april !== 0 || aprilex !== 0 || aprils !== 0) {
      const income = this.incomes.filter(income => (new Date(income.date)).getMonth() === 3);
      const all = income.length !== 0 ? income[0].amount : (this.incomes.length !== 0 ? this.incomes[this.incomes.length-1].amount : 0);
      this.products.push(['Ápr', String(this.getPercent(all, april)), String(this.getPercent(all, aprilex)), String(this.getPercent(all, aprils))]);
      this.spending.push(april + aprilex);
      this.saving.push(aprils);
      this.months.push('Ápr');
    }

    if(may !== 0 || mayex !== 0 || mays !== 0) {
      const income = this.incomes.filter(income => (new Date(income.date)).getMonth() === 4);
      const all = income.length !== 0 ? income[0].amount : (this.incomes.length !== 0 ? this.incomes[this.incomes.length-1].amount : 0);
      this.products.push(['Máj', String(this.getPercent(all, may)), String(this.getPercent(all, mayex)), String(this.getPercent(all, mays))]);
      this.spending.push(may + mayex);
      this.saving.push(mays);
      this.months.push('Máj');
    }

    if(june !== 0 || juneex !== 0 || junes !== 0) {
      const income = this.incomes.filter(income => (new Date(income.date)).getMonth() === 5);
      const all = income.length !== 0 ? income[0].amount : (this.incomes.length !== 0 ? this.incomes[this.incomes.length-1].amount : 0);
      this.products.push(['Jún', String(this.getPercent(all, june)), String(this.getPercent(all, juneex)), String(this.getPercent(all, junes))]);
      this.spending.push(june + juneex);
      this.saving.push(junes);
      this.months.push('Jún');
    }

    if(july !== 0 || julyex !== 0 || julys !== 0) {
      const income = this.incomes.filter(income => (new Date(income.date)).getMonth() === 6);
      const all = income.length !== 0 ? income[0].amount : (this.incomes.length !== 0 ? this.incomes[this.incomes.length-1].amount : 0);
      this.products.push(['Júl', String(this.getPercent(all, july)), String(this.getPercent(all, julyex)), String(this.getPercent(all, julys))]);
      this.spending.push(july + julyex);
      this.saving.push(julys);
      this.months.push('Júl');
    }

    if(august !== 0 || augustex !== 0 || augusts !== 0) {
      const income = this.incomes.filter(income => (new Date(income.date)).getMonth() === 7);
      const all = income.length !== 0 ? income[0].amount : (this.incomes.length !== 0 ? this.incomes[this.incomes.length-1].amount : 0);
      this.products.push(['Aug', String(this.getPercent(all, august)), String(this.getPercent(all, augustex)), String(this.getPercent(all, augusts))]);
      this.spending.push(august + augustex);
      this.saving.push(augusts);
      this.months.push('Aug');
    }

    if(sept !== 0 || septex !== 0 || septs !== 0) {
      const income = this.incomes.filter(income => (new Date(income.date)).getMonth() === 8);
      const all = income.length !== 0 ? income[0].amount : (this.incomes.length !== 0 ? this.incomes[this.incomes.length-1].amount : 0);
      this.products.push(['Szept', String(this.getPercent(all, sept)), String(this.getPercent(all, septex)), String(this.getPercent(all, septs))]);
      this.spending.push(sept + septex);
      this.saving.push(septs);
      this.months.push('Szept');
    }

    if(oct !== 0 || octex !== 0 || octs !== 0) {
      const income = this.incomes.filter(income => (new Date(income.date)).getMonth() === 9);
      const all = income.length !== 0 ? income[0].amount : (this.incomes.length !== 0 ? this.incomes[this.incomes.length-1].amount : 0);
      this.products.push(['Okt', String(this.getPercent(all, oct)), String(this.getPercent(all, octex)), String(this.getPercent(all, octs))]);
      this.spending.push(oct + octex);
      this.saving.push(octs);
      this.months.push('Okt');
    }

    if(nov !== 0 || novex !== 0 || novs !== 0) {
      const income = this.incomes.filter(income => (new Date(income.date)).getMonth() === 10);
      const all = income.length !== 0 ? income[0].amount : (this.incomes.length !== 0 ? this.incomes[this.incomes.length-1].amount : 0);
      this.products.push(['Nov', String(this.getPercent(all, nov)), String(this.getPercent(all, novex)), String(this.getPercent(all, novs))]);
      this.spending.push(nov + novex);
      this.saving.push(novs);
      this.months.push('Nov');
    }


    if(dec !== 0 || decex !== 0 || decs !== 0) {
      const income = this.incomes.filter(income => (new Date(income.date)).getMonth() === 11);
      const all = income.length !== 0 ? income[0].amount : (this.incomes.length !== 0 ? this.incomes[this.incomes.length-1].amount : 0);
      this.products.push(['Dec', String(this.getPercent(all, dec)), String(this.getPercent(all, decex)), String(this.getPercent(all, decs))]);
      this.spending.push(dec + decex);
      this.saving.push(decs);
      this.months.push('Dec');
    }
  }

  private setData() {
    let osszes = 0;
    const spendingByCategories: Map<SpendingCategoriesName, number> = new Map([
      [SpendingCategoriesName.HousingAndUtilities, 0],
      [SpendingCategoriesName.Transportation, 0],
      [SpendingCategoriesName.FoodAndHousehold, 0],
      [SpendingCategoriesName.HealthAndPersonalExpenses, 0],
      [SpendingCategoriesName.ClothingAndOtherShopping, 0],
      [SpendingCategoriesName.EntertainmentAndLeisure, 0],
      [SpendingCategoriesName.ChildrenPerFamily, 0],
      [SpendingCategoriesName.LoansAndDebts, 0],
      [SpendingCategoriesName.InsuranceAndFinancialProducts, 0],
      [SpendingCategoriesName.SavingAndInvesting, 0],
      [SpendingCategoriesName.OtherPerVariableExpenses, 0]
    ]);

    this.recurringExpenses.forEach(recurringExpense => {
      const category = recurringExpense.category as SpendingCategoriesName;

      const current = spendingByCategories.get(category) || 0;
      spendingByCategories.set(category, current + recurringExpense.amount);
      osszes += recurringExpense.amount;
    });

    this.expenses.forEach(expense => {
      const category = expense.category as SpendingCategoriesName;

      const current = spendingByCategories.get(category) || 0;
      spendingByCategories.set(category, current + expense.amount);
      osszes += expense.amount;
    });
    this.spendingByIcons = [
      {icon: SpendingCategoriesIcon.HousingAndUtilities, percent: this.getPercent(osszes, spendingByCategories.get(SpendingCategoriesName.HousingAndUtilities) || 0), color: SpendingCategoriesColor.HousingAndUtilities},
      {icon: SpendingCategoriesIcon.Transportation, percent: this.getPercent(osszes, spendingByCategories.get(SpendingCategoriesName.Transportation) || 0), color: SpendingCategoriesColor.Transportation},
      {icon: SpendingCategoriesIcon.FoodAndHousehold, percent: this.getPercent(osszes, spendingByCategories.get(SpendingCategoriesName.FoodAndHousehold) || 0), color: SpendingCategoriesColor.FoodAndHousehold},
      {icon: SpendingCategoriesIcon.HealthAndPersonalExpenses, percent: this.getPercent(osszes, spendingByCategories.get(SpendingCategoriesName.HealthAndPersonalExpenses) || 0), color: SpendingCategoriesColor.HealthAndPersonalExpenses},
      {icon: SpendingCategoriesIcon.ClothingAndOtherShopping, percent: this.getPercent(osszes, spendingByCategories.get(SpendingCategoriesName.ClothingAndOtherShopping) || 0), color: SpendingCategoriesColor.ClothingAndOtherShopping},
      {icon: SpendingCategoriesIcon.EntertainmentAndLeisure, percent: this.getPercent(osszes, spendingByCategories.get(SpendingCategoriesName.EntertainmentAndLeisure) || 0), color: SpendingCategoriesColor.EntertainmentAndLeisure},
      {icon: SpendingCategoriesIcon.ChildrenPerFamily, percent: this.getPercent(osszes, spendingByCategories.get(SpendingCategoriesName.ChildrenPerFamily) || 0), color: SpendingCategoriesColor.ChildrenPerFamily},
      {icon: SpendingCategoriesIcon.LoansAndDebts, percent: this.getPercent(osszes, spendingByCategories.get(SpendingCategoriesName.LoansAndDebts) || 0), color: SpendingCategoriesColor.LoansAndDebts},
      {icon: SpendingCategoriesIcon.InsuranceAndFinancialProducts, percent: this.getPercent(osszes, spendingByCategories.get(SpendingCategoriesName.InsuranceAndFinancialProducts) || 0), color: SpendingCategoriesColor.InsuranceAndFinancialProducts},
      {icon: SpendingCategoriesIcon.SavingAndInvesting, percent: this.getPercent(osszes, spendingByCategories.get(SpendingCategoriesName.SavingAndInvesting) || 0), color: SpendingCategoriesColor.SavingAndInvesting},
      {icon: SpendingCategoriesIcon.OtherPerVariableExpenses, percent: this.getPercent(osszes, spendingByCategories.get(SpendingCategoriesName.OtherPerVariableExpenses) || 0), color: SpendingCategoriesColor.OtherPerVariableExpenses}
    ];
  }

  private getPercent(all: number, current: number) {
    return (current * 100) / all;
  }
}
