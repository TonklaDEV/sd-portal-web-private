import { Component, OnInit, ViewChild } from '@angular/core';
import { ApexOptions } from 'apexcharts';
import { ThemeModeService } from 'src/app/shared/services/theme-mode/theme-mode.service';

@Component({
  selector: 'app-treemap-chart',
  templateUrl: './treemap-chart.component.html',
  styleUrls: ['./treemap-chart.component.scss'],
})
export class TreemapChartComponent implements OnInit {
  
  private themeMode!: boolean;
  protected chartOptions: ApexOptions | any;

  constructor(private readonly themeModeService: ThemeModeService ) { }

  public ngOnInit(): void {
    this.chartOptions = this.getDataChartTreemap(this.themeMode);

    this.themeModeService.$themeMode.subscribe((themeMode: boolean) => {
      this.chartOptions = this.getDataChartTreemap(themeMode);
    })
  }

  public generateData(count: number, yrange: { max: number; min: number }) {
    let i = 0;
    let series = [];
    while (i < count) {
      let x = 'w' + (i + 1).toString();
      let y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y,
      });
      i++;
    }
    return series;
  }

  private getDataChartTreemap(themeMode: boolean): ApexOptions {
    return {
      series: [
        {
          name: "egp",
          data: [
            {
              x: 'egp-template-service_SD1_prapat',
              y: 6205,
            },
            {
              x: 'egp-doc-commit-service_SD1_prapat',
              y: 5203,
            },
            {
              x: 'egp-approval-service_SD1_prapat',
              y: 3858,
            },
            {
              x: 'egp-rdb-service_SD1_prapat',
              y: 3721,
            },
            {
              x: 'egp-doc-publish-service_SD1_prapat',
              y: 3179,
            },
            {
              x: 'egp-doc-examine-service_SD1_prapat',
              y: 3120,
            },
            {
              x: 'egp-merchant-ebidding-service_SD1_prapat',
              y: 2872,
            },
            {
              x: 'egp-doc-publish-web_SD1_prapat',
              y: 2783,
            },
            {
              x: 'egp-doc-price-estimate-service_SD1_prapat',
              y: 2312,
            },
            {
              x: 'egp-merchant-emarket-service_SD1_prapat',
              y: 1862,
            },
            {
              x: 'egp-improve-service_SD1_prapat',
              y: 1806,
            },
            {
              x: 'egp-doc-tor-web_SD1_prapat',
              y: 1637,
            },
            {
              x: 'egp-thai-auction-service_SD1_prapat',
              y: 1525,
            },
            {
              x: 'egp-approval-web_SD1_prapat',
              y: 1474,
            },
            {
              x: 'egp-procure-project-service_SD1_prapat',
              y: 1427,
            },
            {
              x: 'egp-project-service_SD1_prapat',
              y: 1426,
            },
            {
              x: 'egp-guarantee-interface-service_SD1_prapat',
              y: 1356,
            },
            {
              x: 'egp-doc-tor-service_SD1_prapat',
              y: 1314,
            },
            {
              x: 'egp-doc-commit-web_SD1_prapat',
              y: 1289,
            },
            {
              x: 'egp-doc-price-estimate-web_SD1_prapat',
              y: 1266,
            },
            {
              x: 'egp-doc-winner-service_SD1_prapat',
              y: 1131,
            },
            {
              x: 'pccth-vat-batch-service_SD1_wongsathorn',
              y: 1118,
            },
            {
              x: 'egp-rdb-web_SD1_prapat',
              y: 1046,
            },
            {
              x: 'egp-merchant-emarket-web_SD1_prapat',
              y: 1033,
            },
            {
              x: 'egp-reg-merchant-service_SD1_prapat',
              y: 930,
            },
            {
              x: 'egp-doc-examine-web_SD1_prapat',
              y: 892,
            },
            {
              x: 'egp-authen-service_SD1_prapat',
              y: 840,
            },
            {
              x: 'egp-reg-agency-service_SD1_prapat',
              y: 819,
            },
            {
              x: 'egp-sme-service_SD1_prapat',
              y: 746,
            },
            {
              x: 'egp-merchant-ebidding-web_SD1_prapat',
              y: 722,
            },
            {
              x: 'egp-doc-report-web_SD1_prapat',
              y: 686,
            },
            {
              x: 'egp-doc-approve-service_SD1_prapat',
              y: 675,
            },
            {
              x: 'egp-utils_SD1_prapat',
              y: 666,
            },
            {
              x: 'egp-acc-merchant-service_SD1_prapat',
              y: 656,
            },
            {
              x: 'egp-doc-report-service_SD1_prapat',
              y: 650,
            },
            {
              x: 'egp-doc-review-service_SD1_prapat',
              y: 632,
            },
            {
              x: 'egp-reg-merchant-web_SD1_prapat',
              y: 622,
            },
            {
              x: 'egp-doc-winner-web_SD1_prapat',
              y: 613,
            },
            {
              x: 'egp-upload-service_SD1_prapat',
              y: 601,
            },
            {
              x: 'egp-blockchain-service_SD1_prapat',
              y: 566,
            },
            {
              x: 'egp-acc-merchant-web_SD1_prapat',
              y: 552,
            },
            {
              x: 'egp-announce-batch-service_SD1_prapat',
              y: 552,
            },
            {
              x: 'egp-sync-ebidding-service_SD1_prapat',
              y: 548,
            },
            {
              x: 'egp-reg-agency-web_SD1_prapat',
              y: 540,
            },
            {
              x: 'egp-doc-approve-web_SD1_prapat',
              y: 452,
            },
            {
              x: 'egp-report-service_SD1_prapat',
              y: 423,
            },
            {
              x: 'egp-ecatalog-service_SD1_prapat',
              y: 391,
            },
            {
              x: 'egp-doc-review-web_SD1_prapat',
              y: 362,
            },
            {
              x: 'egp-master-ebidding-service_SD1_prapat',
              y: 354,
            },
            {
              x: 'egp-register-interface-service_SD1_prapat',
              y: 350,
            },
            {
              x: 'egp-flow-agency-service_SD1_prapat',
              y: 348,
            },
            {
              x: 'egp-doc-review-merchant-web_SD1_prapat',
              y: 317,
            },
            {
              x: 'egp-merchant-web_SD1_prapat',
              y: 289,
            },
            {
              x: 'egp-flow-agency-web_SD1_prapat',
              y: 280,
            },
            {
              x: 'egp-guarantee-web_SD1_prapat',
              y: 276,
            },
            {
              x: 'egp-interface-service_SD1_prapat',
              y: 275,
            },
            {
              x: 'egp-doc-review-merchant-service_SD1_prapat',
              y: 264,
            },
            {
              x: 'egp-acc-agency-service_SD1_prapat',
              y: 262,
            },
            {
              x: 'egp-upload-web_SD1_prapat',
              y: 259,
            },
            {
              x: 'egp-trader-report-web_SD1_prapat',
              y: 257,
            },
            {
              x: 'egp-report-web_SD1_prapat',
              y: 250,
            },
            {
              x: 'egp-trader-report-service_SD1_prapat',
              y: 237,
            },
            {
              x: 'egp-procure-interface-service_SD1_prapat',
              y: 234,
            },
            {
              x: 'egp-authen-web_SD1_prapat',
              y: 231,
            },
            {
              x: 'egp-project-web_SD1_prapat',
              y: 225,
            },
            {
              x: 'egp-budget-report-service_SD1_prapat',
              y: 207,
            },
            {
              x: 'egp-budget-report-web_SD1_prapat',
              y: 218,
            },
            {
              x: 'egp-seed-template-web_SD1_prapat',
              y: 201,
            },
            {
              x: 'egp-login-keycloak-web_SD1_prapat',
              y: 198,
            },
            {
              x: 'egp-reg-web_SD1_prapat',
              y: 194,
            },
            {
              x: 'egp-master-ebidding-web_SD1_prapat',
              y: 192,
            },
            {
              x: 'egp-budget-web_SD1_prapat',
              y: 191,
            },
            {
              x: 'egp-sync-emarket-service_SD1_prapat',
              y: 172,
            },
            {
              x: 'egp-mail-service_SD1_prapat',
              y: 153,
            },
            {
              x: 'egp-kyc-service_SD1_prapat',
              y: 141,
            },
            {
              x: 'egp-ecatalog-interface-service_SD1_prapat',
              y: 127,
            },
            {
              x: 'egp-budget-service_SD1_prapat',
              y: 126,
            },
            {
              x: 'egp-agency-service_SD1_prapat',
              y: 109,
            },
            {
              x: 'testhttpcode_SD1_wongsathorn',
              y: 10,
            },
            {
              x: 'pccth-sp-seed-service_SD1_wongsathorn',
              y: 3,
            },
            {
              x: '',
              y: null,
            },
          ],
        },
        {
          name: "rd",
          data: [
            {
            x: 'rd-vatsbtintra-web_SD1_wongsathorn',
            y: 4163,
          },
          {
            x: 'rd-vatsbtde-web_SD1_wongsathorn',
            y: 3133,
          },
          {
            x: 'rd-ves-service_SD1_Prawith',
            y: 1461,
          },
          {
            x: 'rd-sbtintra-de01-service_SD1_wongsathorn',
            y: 822,
          },
          {
            x: 'rd-vatsbtintra-change-service_SD1_wongsathorn',
            y: 720,
          },
          {
            x: 'rd-user-oauth-service_SD1_wongsathorn',
            y: 649,
          },
          {
            x: 'rd-sbtde-pt090-service_SD1_wongsathorn',
            y: 635,
          },
          {
            x: 'rd-vatintra-de01-service_SD1_wongsathorn',
            y: 604,
          },
          {
            x: 'rd-vatde-pp30-service_SD1_wongsathorn',
            y: 409,
          },
          {
            x: 'rd-vatde-pp090-service_SD1_wongsathorn',
            y: 383,
          },
          {
            x: 'rd-vatsbtintra-dln-service_SD1_wongsathorn',
            y: 337,
          },
          {
            x: 'rd-common-service_SD1_wongsathorn',
            y: 329,
          },
          {
            x: 'rd-vatintra-pp07-service_SD1_wongsathorn',
            y: 325,
          },
          {
            x: 'rd-vs-seed-service_SD1_wongsathorn',
            y: 323,
          },
          {
            x: 'rd-vatsbt-search-web_SD1_wongsathorn',
            y: 262,
          },
          {
            x: 'rd-vatsbtde-dln-service_SD1_wongsathorn',
            y: 258,
          },
          {
            x: 'rd-nid-service_SD1_wongsathorn',
            y: 255,
          },
          {
            x: 'rd-tcl-service_SD1_wongsathorn',
            y: 252,
          },
          {
            x: 'rd-sbtde-pt010-service_SD1_wongsathorn',
            y: 251,
          },
          {
            x: 'rd-vatde-pp010-service_SD1_wongsathorn',
            y: 246,
          },
          {
            x: 'rd-vatde-pp091-service_SD1_wongsathorn',
            y: 241,
          },
          {
            x: 'rd-vatsbt-search-service_SD1_wongsathorn',
            y: 106,
          },
          {
            x: 'rd-vatde-t17-service_SD1_wongsathorn',
            y: 103,
          },
          {
            x: 'rd-sbtde-t18-service_SD1_wongsathorn',
            y: 86,
          },
          {
            x: 'rd-vatintra-pp06-service_SD1_wongsathorn',
            y: 68,
          },
          {
            x: 'rd-vatminio-service_SD1_wongsathorn',
            y: 45,
          },
          {
            x: 'rd-vatde-pp36-service_SD1_wongsathorn',
            y: 153,
          },
          {
            x: 'rd-sbtde-pt40-service_SD1_wongsathorn',
            y: 149,
          },
          {
            x: 'rd-sso-login-web_SD1_wongsathorn',
            y: 145,
          },
          {
            x: 'rd-vatsbt-cal-web_SD1_wongsathorn',
            y: 192,
          },
          {
            x: 'rd-vatsbt-cal-service_SD1_wongsathorn',
            y: 186,
          },
          {
            x: 'rd-vatsbtintra-spool-print-service_SD1_wongsathorn',
            y: 175,
          },
          {
            x: 'rd-vatde-pp012-service_SD1_wongsathorn',
            y: 222,
          },

          {
            x: 'rd-vatprinting-service_SD1_wongsathorn',
            y: 211,
          },

          {
            x: 'rd-vatintra-pp013-service_SD1_wongsathorn',
            y: 206,
          },
          {
            x: 'rd-vatsbtintra-taskjob-service_SD1_wongsathorn',
            y: 112,
          },
        ],
      },
      ],
      legend: {
        show: false,
      },
      chart: {
        height: 800,
        type: 'treemap',
        toolbar: {
          offsetY: 20,
        }
      },
      title: {
        margin: 20,
        offsetY: 10,
        text: 'ข้อมูล Issues ปัจจุบัน',
        style: {
          fontSize: '20px',
          color: themeMode ? '#E4E6EB' : '#697A8D',
        }
      },
      stroke: {
        colors: themeMode ? ['#3a3b3c'] : ['#FFFFFF']
      },
    }
  }
}
