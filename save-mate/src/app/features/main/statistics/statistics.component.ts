import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';
import { SpendingByIcon } from './models/spending-by-icon';
import { SpendingCategoriesIcon } from 'src/app/core/enums/spending-categories-icon.enum';
import { SpendingCategoriesColor } from 'src/app/core/enums/spending-categories-color.enum';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from './dialogs/info-dialog/info-dialog.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements AfterViewInit {
  @ViewChild('lineChart', { static: false }) lineChartElement?: ElementRef;
  @ViewChild('barChart', { static: false }) barChartElement?: ElementRef;
  private lineChartInstance?: echarts.ECharts;
  private lineChartOption?: echarts.EChartsOption;
  private barChartInstance?: echarts.ECharts;
  private barChartOption?: echarts.EChartsOption;

  public spendingByIcons: SpendingByIcon[] = [
    {icon: SpendingCategoriesIcon.HousingAndUtilities, percent: 10, color: SpendingCategoriesColor.HousingAndUtilities},
    {icon: SpendingCategoriesIcon.Transportation, percent: 20, color: SpendingCategoriesColor.Transportation},
    {icon: SpendingCategoriesIcon.FoodAndHousehold, percent: 30, color: SpendingCategoriesColor.FoodAndHousehold},
    {icon: SpendingCategoriesIcon.HealthAndPersonalExpenses, percent: 40, color: SpendingCategoriesColor.HealthAndPersonalExpenses},
    {icon: SpendingCategoriesIcon.ClothingAndOtherShopping, percent: 50, color: SpendingCategoriesColor.ClothingAndOtherShopping},
    {icon: SpendingCategoriesIcon.EntertainmentAndLeisure, percent: 60, color: SpendingCategoriesColor.EntertainmentAndLeisure},
    {icon: SpendingCategoriesIcon.ChildrenPerFamily, percent: 20, color: SpendingCategoriesColor.ChildrenPerFamily},
    {icon: SpendingCategoriesIcon.LoansAndDebts, percent: 30, color: SpendingCategoriesColor.LoansAndDebts},
    {icon: SpendingCategoriesIcon.InsuranceAndFinancialProducts, percent: 40, color: SpendingCategoriesColor.InsuranceAndFinancialProducts},
    {icon: SpendingCategoriesIcon.SavingAndInvesting, percent: 50, color: SpendingCategoriesColor.SavingAndInvesting},
    {icon: SpendingCategoriesIcon.OtherPerVariableExpenses, percent: 60, color: SpendingCategoriesColor.OtherPerVariableExpenses}
  ];

  constructor(private dialog: MatDialog) {}

  ngAfterViewInit(): void {
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
  }

  @HostListener('window:resize')
  onResize() {
    console.log(window.innerWidth);
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
    this.lineChartInstance?.resize();
    this.barChartInstance?.resize();
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
        data: ['Jan', 'Febr', 'Márc', 'Ápr', 'Máj', 'Jún', 'Júl']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Költések',
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        },
        {
          name: 'Megtakarítás',
          data: [120, 20, 24, 128, 100, 407, 60],
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
        source: [
          ['product', 'Fix költség', 'Szórakozás', 'Megtakarítás'],
          ['Jan', 43.3, 85.8, 93.7],
          ['Febr', 83.1, 73.4, 55.1],
          ['Márc', 86.4, 65.2, 82.5],
          ['Ápr', 72.4, 53.9, 39.1],
          ['Máj', 43.3, 85.8, 93.7],
          ['Jún', 83.1, 73.4, 55.1],
          ['Júl', 86.4, 65.2, 82.5]
        ]
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
    console.log(this.barChartOption);
  }
}
