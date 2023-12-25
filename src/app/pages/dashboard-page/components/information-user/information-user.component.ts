import { Component, OnInit } from "@angular/core";

import { ApexOptions } from 'apexcharts';
import { ThemeModeService } from "src/app/shared/services/theme-mode/theme-mode.service";

@Component({
  selector: "app-information-user",
  templateUrl: "./information-user.component.html",
  styleUrls: ["./information-user.component.scss"],
})
export class InformationUserComponent implements OnInit {
  private themeMode!: boolean;

  protected chartOptionsProject!: ApexOptions | any;
  protected chartOptionsPassProject!: ApexOptions | any;
  protected chartOptionsChartEditIssue!: ApexOptions | any;

  constructor(private readonly themeModeService: ThemeModeService) {
    this.themeMode = this.themeModeService.$themeMode.value;
  }

  public ngOnInit(): void {
    this.chartOptionsProject = this.getDataChartProject(this.themeMode);
    this.chartOptionsPassProject = this.getDataChartPassProject(this.themeMode);
    this.chartOptionsChartEditIssue = this.getDataChartEditIssue();

    this.themeModeService.$themeMode.subscribe((themeMode: boolean) => {
      this.chartOptionsProject = this.getDataChartProject(themeMode);
      this.chartOptionsPassProject = this.getDataChartPassProject(themeMode);
      this.chartOptionsChartEditIssue = this.getDataChartEditIssue();
    });
  }

  private getDataChartProject(themeMode: boolean): ApexOptions {
    return {
      series: [
        {
          name: '2022',
          data: new Array<number>(0, 10, 20, 30, 40, 50, 0),
        },
        {
          name: '2021',
          data: new Array<number>(0, 15, 0, 0, 0, 0, 0),
          color: 'rgb(0, 227, 150)',
        },
      ],
      chart: {
        type: "bar",
        height: 285,
        toolbar: {
          show: false,
        },
      },
      title: {
        text: 'จำนวน Project/WAR File ที่ตรวจสอบ',
        align: 'left',
        offsetX: 5,
        style: {
          color: themeMode ? '#E4E6EB' : '#566A7F',
          fontSize: '20px',
          fontWeight: 'medium',
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4.5,
          columnWidth: 25 + (50 / (1 + 30 * Math.exp(-7 / 3))) + '%',
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: themeMode ?["#242526"] : ["#FFFFFF"],
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        offsetY: -13,
        markers: {
          radius: 50
        },
        fontSize: '14px',
        fontWeight: 'medium',
        labels: {
          colors: themeMode ? '#E4E6EB' : '#697A8D',
        },
      },
      xaxis: {
        type: 'category',
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
        ],
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: themeMode ? '#B0B3B8' : '#697A8D',
            fontSize: '15px',
            fontWeight: 'medium',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: themeMode ? '#B0B3B8' : '#697A8D',
            fontSize: '15px',
            fontWeight: 'medium',
          },
        },
      },
      grid: {
        borderColor: themeMode ? '#3a3b3c' : 'rgba(229 ,231 ,235, 0.5)',
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      fill: {
        opacity: 1,
        colors: new Array<string>('#696CFF', '#787BFF'),
      },
      tooltip: {
        y: {
          formatter: (value: number): string => {
            return value.toString();
          }
        },
      },
    };
  }

  private getDataChartPassProject(themeMode: boolean): ApexOptions {
    return {
      chart: {
        height: 195,
        type: 'radialBar',
      },
      series: [78],
      plotOptions: {
        radialBar: {
          startAngle: -145,
          endAngle: 145,
          dataLabels: {
            name: {
              offsetY: 20,
              color: themeMode ? '#B0B3B8' : '#566A7F',
              fontSize: '12px',
              fontWeight: 'medium',
            },
            value: {
              offsetY: -25,
              color: themeMode ? '#E4E6EB' : '#566A7F',
              fontSize: '16px',
              fontWeight: 'medium',
            },
          },
          track: {
            background: 'transparent',
          },
        },
      },
      colors: themeMode ? ['#8385FF'] : ['#696CFF'],
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 0.4,
          gradientToColors: themeMode ? ['#8385FF'] :  ["#696CFF"],
          stops: [0, 100]
        }
      },
      states: {
        hover: {
          filter: {
            type: 'none',
          },
        },
      },
      stroke: {
        dashArray: 5.2,
      },
      labels: ['PASS'],
    };
  }

  private getDataChartEditIssue(): ApexOptions {
    return {
      series: [{
        name: "series-1",
        data: new Array (50, 30, 80, 100, 125, 160)
      }],
      chart: {
        offsetX: -10,
        offsetY: -20,
        height: 130,
        width: '100%',
        type: 'line',
        background: 'transparent',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false,
        },
        dropShadow: {
          enabled: true,
          enabledOnSeries: undefined,
          top: 10,
          left: 0,
          blur: 4,
          color: '#FFAB00',
          opacity: 0.25
        }
      },
      colors: ['#FFAB00'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      grid: {
        show: false,
      },
      xaxis: {
        categories: undefined,
        labels: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          show: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        show: false,
      },
    }
  }
}
