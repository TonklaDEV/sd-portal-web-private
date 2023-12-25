import { Component, OnInit } from "@angular/core";

import { ApexOptions } from "apexcharts";
import { ThemeModeService } from "src/app/shared/services/theme-mode/theme-mode.service";

@Component({
  selector: "app-information-project-user",
  templateUrl: "./information-project-user.component.html",
  styleUrls: ["./information-project-user.component.scss"],
})
export class InformationProjectUserComponent implements OnInit {
  protected chartOptionsProjectReview!: ApexOptions | any;
  protected chartOptionsIssueDetail!: ApexOptions | any;
  private themeMode!: boolean;

  constructor(private readonly themeModeService: ThemeModeService) {}

  public ngOnInit(): void {
    this.chartOptionsProjectReview = this.getDataChartProjectReview(this.themeMode);
    this.chartOptionsIssueDetail = this.getDataChartIssueDetail(this.themeMode);

    this.themeModeService.$themeMode.subscribe((themeMode: boolean) => {
      this.chartOptionsProjectReview = this.getDataChartProjectReview(themeMode);
      this.chartOptionsIssueDetail = this.getDataChartIssueDetail(themeMode);
    });
  }

  private getDataChartProjectReview(themeMode: boolean): ApexOptions {
    return {
      series: [22, 40, 6, 4],
      labels: ['RD', 'CGD', 'ED', 'PCC'],
      chart: {
        type: 'donut',
        height: 175,
        width: 195,
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
          donut: {
            size: '70%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                offsetY: 20,
                color: themeMode ? '#E4E6EB' : '#566A7F',
                fontSize: '17px',
              },
              value: {
                offsetY: -20,
                color: themeMode ? '#E4E6EB' : '#566A7F',
                fontSize: '22px',
                fontWeight: 'medium',
                formatter: (value: string): string => {
                  return `${value}%`;
                },
              },
              total: {
                show: true,
                color: themeMode ? '#B0B3B8' : '#697A8D',
                label: 'Review',
                fontSize: '17px',
                fontWeight: 'medium',
                formatter: (w: any): string => {
                  return `${w.globals.seriesTotals.reduce((a: number, b: number): number => a + b, 0)}%`;
                },
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 7,
        colors: themeMode ? ['#242526'] : ['#FFFFFF'],
      },
      legend: {
        show: false,
      },
    };
  }

  private getDataChartIssueDetail(themeMode: boolean): ApexOptions {
    return{
      series: [{
        name: 'series-1',
        data: new Array(0, 0, 22, 50, 78, 0, 0),
      }],
      colors: themeMode? ['#8385FF'] : ['#696cff'],
      chart: {
        height: 250,
        width: 335,
        type: 'area',
        sparkline: {
          enabled: false,
        },
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false,
        }
      },
      plotOptions: {
        area: {
          fillTo: 'end',
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        lineCap: 'square',
        colors: undefined,
        width: 2,
        dashArray: 0,
      },
      fill: {
        colors: undefined,
      },
      xaxis: {
        type: 'category',
        labels: {
          style: {
            colors: themeMode ? '#B0B3B8' : '#697A8D',
          }
        },
        categories: new Array("Jan","Feb","Mar","Apr","May","Jun","Jul",),
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        }
      },
      yaxis: {
        show: false,
        tickAmount: 4,
        max: 50,
        min: 1
      },
      grid: {
        show: true,
        borderColor: themeMode ? '#3a3b3c' : '#E5E4E2',
        strokeDashArray: 3,
        position: 'back',
        xaxis: {
          lines: {
            show: false
           }
        },
        yaxis: {
          lines: {
            show: true,
           },
        },
      },
      tooltip: {
        followCursor: true,
        x: {
          show: true,
        },
        fixed: {
          enabled: true,
          position: 'topRight',
          offsetX: 0,
          offsetY: 0,
        },
      },
    }
  }
}
