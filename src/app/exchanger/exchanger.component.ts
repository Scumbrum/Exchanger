import { Component, Input, OnInit } from '@angular/core';
import CurrencyChoserServices from '../services/CurrencyChoserService';

@Component({
  selector: 'app-exchanger',
  templateUrl: './exchanger.component.html',
  styleUrls: ['./exchanger.component.scss'],
  providers: [CurrencyChoserServices]
})
export class ExchangerComponent implements OnInit {
  @Input() currencies:string[] = []
  @Input() loading = false
  @Input() error:string|null = null

  get firstCurrency() {
    return this.currencyService.firstSymbol
  }

  set firstCurrency(newCurrency: string) {
    this.currencyService.firstSymbol = newCurrency
  }

  get secondCurrency() {
    return this.currencyService.secondSymbol
  }

  set secondCurrency(newCurrency:string) {
    this.currencyService.secondSymbol = newCurrency
  }

  set firstAmount(amount: number) {
    this.currencyService.firstAmount = amount
  }

  get firstAmount() {
    return this.currencyService.firstAmount
  }

  set secondAmount(amount: number) {
    this.currencyService.secondAmount = amount
  }

  get secondAmount() {
    return this.currencyService.secondAmount
  }

  constructor(private currencyService: CurrencyChoserServices) { }

  ngOnInit(): void {
    this.currencyService.setInitialValues({
      firstAmount: 0,
      secondAmount: 0,
      firstSymbol: "USD",
      secondSymbol: "UAH"
    })
  }

}
