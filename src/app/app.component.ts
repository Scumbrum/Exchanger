import { Component, OnInit } from '@angular/core';
import { ISymbols } from './models';
import CurrencyAPIService from './services/CurrencyService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currencies: string[] = ["USD", "UAH"]
  loading = false
  error: string|null = null

  constructor(private currency: CurrencyAPIService) {}

  ngOnInit(): void {
    this.currency.getAllSymbols().subscribe((currencies) => this.currencies = currencies)
    this.currency.loading$.subscribe((isLoading) => this.loading = isLoading)
    this.currency.error$.subscribe((error) => this.error = error)
  }
  
}
