import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  currency: BehaviorSubject<string> = new BehaviorSubject<string>("INR");
  constructor() { }


  getCurrency() {
    return this.currency.asObservable();
  }

  setCurrency(curr: string) {
    return this.currency.next(curr);
  }

}
