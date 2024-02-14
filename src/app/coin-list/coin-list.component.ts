import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CurrencyService } from '../service/currency.service';
@Component({
  selector: 'app-coin-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginator, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatSortModule],
  templateUrl: './coin-list.component.html',
  styleUrl: './coin-list.component.scss'
})
export default class CoinListComponent implements OnInit, AfterViewInit {
  currency = 'INR'
  bannerData: any = [];
  displayedColumns: string[] = ['symbol', 'current_price', 'price_change_percentage_24h', 'market_cap'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  private api = inject(ApiService)
  private route = inject(Router)
  private CurrencyService = inject(CurrencyService);

  ngOnInit(): void {

    this.getBannerData();
    this.getAllData();

    this.CurrencyService.getCurrency().subscribe({
      next: (res) => {
        this.currency = res;
        this.getAllData();
        this.getBannerData();

      }
    })
  }

  ngAfterViewInit() {

  }

  getBannerData() {
    this.api.getTrendingCurrency(this.currency).subscribe({
      next: (res) => {
        console.log("Get trending value", res)
        this.bannerData = res;
      }
    })
  }

  getAllData() {
    this.api.getCurrencyData(this.currency).subscribe({
      next: (res) => {
        console.log("Get all Data", res)
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getToDisplay(row: any) {
    console.log(row)
    this.route.navigate(['coin-detail', row.id])
  }
}
