import { Routes } from '@angular/router';
import CoinListComponent from './coin-list/coin-list.component';
import CoinDetailComponent from './coin-detail/coin-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'coin-list', pathMatch: 'full' },
  { path: 'coin-list', loadComponent: () => CoinListComponent },
  { path: 'coin-detail/:id', loadComponent: () => CoinDetailComponent }
];
