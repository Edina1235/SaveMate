import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { SpendingByCategory } from 'src/app/core/models/spending-by-category';
import * as echarts from 'echarts';
import { CategoryToReduce } from 'src/app/core/models/category-to-reduce';
import { SpendingCategoriesIcon } from 'src/app/core/enums/spending-categories-icon.enum';
import { ThousandSpacePipe } from 'src/app/shared/pipe/thousand-space.pipe';
import { MatDialog } from '@angular/material/dialog';
import { AddDebtComponent } from './dialogs/add-debt/add-debt.component';
import { AddingFixedSpendComponent } from './dialogs/adding-fixed-spend/adding-fixed-spend.component';
import { AddingSavingComponent } from './dialogs/adding-saving/adding-saving.component';
import { AddingSpendingComponent } from './dialogs/adding-spending/adding-spending.component';

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
      amount: 10000
    },
    {
      category: SpendingCategoriesName.ClothingAndOtherShopping,
      amount: 20000
    },
    {
      category: SpendingCategoriesName.FoodAndHousehold,
      amount: 30000
    },
    {
      category: SpendingCategoriesName.HealthAndPersonalExpenses,
      amount: 100000
    },
    {
      category: SpendingCategoriesName.OtherPerVariableExpenses,
      amount: 1000
    },
    {
      category: SpendingCategoriesName.LoansAndDebts,
      amount: 5000
    },
    {
      category: SpendingCategoriesName.HousingAndUtilities,
      amount: 80000
    }
  ];

  public bigNumber: number = 60000;
  public categoriesToReduce: CategoryToReduce[] = [
    {category: SpendingCategoriesIcon.FoodAndHousehold, percent: 25},
    {category: SpendingCategoriesIcon.ClothingAndOtherShopping, percent: 75},
    {category: SpendingCategoriesIcon.OtherPerVariableExpenses, percent: 50},
    {category: SpendingCategoriesIcon.HousingAndUtilities, percent: 20}
  ];

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
    
    this.chartInstance?.resize();
    this.chartInstanceDebt?.resize();
  }

  @ViewChild('chart', { static: false }) chartElement?: ElementRef;
  @ViewChild('chartDebt', { static: false }) chartElementDebt?: ElementRef;
  private chartInstance?: echarts.ECharts;
  private chartOptions?: echarts.EChartsOption;
  private chartInstanceDebt?: echarts.ECharts;
  private chartOptionsDebt?: echarts.EChartsOption;
  private colors: string[] = [];

  ngOnInit(): void {
    this.categoriesToReduce.sort((a,b) => {
      if(a.percent < b.percent) return 1;
      else if (a.percent > b.percent) return -1;
      return 0;
    });
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
              private dialog: MatDialog) {}

  public onClickOpenDebtDialog() {
    this.dialog.open(AddDebtComponent, {
      autoFocus: false
    });
  }

  public onClickOpenFixedSpendDialog() {
    this.dialog.open(AddingFixedSpendComponent, {
      autoFocus: false
    });
  }

  public onClickOpenAddingSavingDialog() {
    this.dialog.open(AddingSavingComponent, {
      autoFocus: false
    });
  }

  public onClickOpenAddingSpendingDialog() {
    this.dialog.open(AddingSpendingComponent, {
      autoFocus: false
    });
  }

  private initializeCharts() { 
    if(this.chartInstance && this.chartInstanceDebt) {
      this.setOption();
      this.setOptionDebt();
      if(this.chartOptions && this.chartOptionsDebt) {
        this.chartInstance.setOption(this.chartOptions);
        this.chartInstanceDebt.setOption(this.chartOptionsDebt);
      }
    }    
  }

  private setOption() {
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
          data: this.getChartData()
        }
      ]
    } as echarts.EChartsOption;
  }

  private getChartData() {
    const chartData: { value: number; name: SpendingCategoriesName; }[] = [];
    this.spendingByCategory.forEach(data => {
      chartData.push({
        value: data.amount,
        name: data.category
      });
      this.colors.push(this.getColorToCategory(data.category));
    });
    return chartData;
  }

  private setOptionDebt() {
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
          data: this.getChartDataDebt()
        }
      ]
    } as echarts.EChartsOption;
  }

  private getChartDataDebt() {
    return [
      {value: 50000, name: 'Kifizetve'},
      {value: 100000, name: 'Fennmaradt'}
    ];
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
}
