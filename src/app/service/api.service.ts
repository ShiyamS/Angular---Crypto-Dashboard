import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);

  getCurrencyData(currency: string) {
    return this.http.get<any>(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en`)
  }

  getTrendingCurrency(currency: string) {
    return this.http.get<any>(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko-desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h&locale=en`)
  }

  getGraphicalCurrencyData(coinId: string, currency: string, days: number) {
    return this.http.get<any>(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`)
  }

  getCurrencyById(coidId: string) {
    return this.http.get<any>(`https://api.coingecko.com/api/v3/coins/${coidId}`)

  }
}
