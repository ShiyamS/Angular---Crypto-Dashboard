import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from "chart.js";
import { BaseChartDirective } from "ng2-charts"
import { NgChartsModule } from 'ng2-charts';
import { CurrencyService } from '../service/currency.service';
@Component({
  selector: 'app-coin-detail',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './coin-detail.component.html',
  styleUrl: './coin-detail.component.scss'
})
export default class CoinDetailComponent implements OnInit, OnDestroy {

  coinData!: any;
  coinId!: string;
  currency: string = "INR";
  days: number = 1;

  private api = inject(ApiService)
  private activatedRoute = inject(ActivatedRoute)
  private readonly destory = new Subject<boolean>();
  private CurrencyService = inject(CurrencyService)

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: `Price Trends`,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: '#009688',
        pointBackgroundColor: '#009688',
        pointBorderColor: '#009688',
        pointHoverBackgroundColor: '#009688',
        pointHoverBorderColor: '#009688',

      }
    ],
    labels: []
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1
      }
    },

    plugins: {
      legend: { display: true },
    }
  };
  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) myLineChart!: BaseChartDirective;

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.destory)).subscribe((param: any) => {
      this.coinId = param.get('id')
    })

    this.getCoidData();
    this.getGraphData(this.days);

    this.CurrencyService.getCurrency().subscribe({
      next: (res) => {
        this.currency = res;
        this.getGraphData(this.days);
        this.getCoidData();

      }
    })
  }


  ngOnDestroy(): void {
    this.destory.next(true);
    this.destory.complete();
  }

  getCoidData() {
    this.api.getCurrencyById(this.coinId).pipe(takeUntil(this.destory)).subscribe({
      next: (res) => {
        if (this.currency === "USD") {
          res.market_data.current_price.inr = res.market_data.current_price.usd
          res.market_data.market_cap.inr = res.market_data.market_cap.usd
        }
        res.market_data.current_price.inr = res.market_data.current_price.inr
        res.market_data.market_cap.inr = res.market_data.market_cap.inr
        this.coinData = res;
      }
    })
  }

  getGraphData(days: number) {
    this.days = days;
    this.api.getGraphicalCurrencyData(this.coinId, this.currency, this.days).pipe(takeUntil(this.destory)).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.myLineChart.chart?.update();
          console.log("called!S")
        }, 300)
        console.log("chart data", res);
        this.lineChartData.datasets[0].data = res.prices.map((data: any) => {
          return data[1];
        })
        this.lineChartData.labels = res.prices.map((data: any) => {
          let date = new Date(data[0]);
          let time = date.getHours() > 12 ?
            `${date.getHours() - 12} : ${date.getMinutes()} PM` :
            `${date.getHours()} : ${date.getMinutes()} AM`;
          return this.days === 1 ? time : date.toLocaleDateString();
        })


      }
    })
  }


}
