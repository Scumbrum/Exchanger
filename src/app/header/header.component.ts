import { Component, OnInit } from '@angular/core';
import CurrencyAPIService from '../services/CurrencyService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor (private currency: CurrencyAPIService) {}
  courseEUR = 0
  courseUSD = 0
  ngOnInit(): void {
    this.currency.getCourseOf("USD", "UAH")
    .subscribe((response) => {
      this.courseUSD = +response.rates["UAH"].toFixed(2)
    })
    this.currency.getCourseOf("EUR", "UAH")
    .subscribe((response) => {
      this.courseEUR = +response.rates["UAH"].toFixed(2)
    })
  }

}
