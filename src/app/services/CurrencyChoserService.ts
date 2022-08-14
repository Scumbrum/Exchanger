import { Injectable } from "@angular/core";
import { BehaviorSubject, debounceTime, filter,  merge, switchMap } from "rxjs";
import { IExchangeState, InputUsedType, IRates } from "../models";
import CurrencyAPIService from "./CurrencyService";

@Injectable()
export default class CurrencyChoserServices {

    private state = {
        firstSymbol$: new BehaviorSubject(""),
        secondSymbol$: new BehaviorSubject(""),
        firstAmount$: new BehaviorSubject(0),
        secondAmount$: new BehaviorSubject(0),
    }

    private typedIN:InputUsedType = InputUsedType.NONE

    constructor(private currencyAPI: CurrencyAPIService) {
        merge(
            this.state.firstAmount$,
            this.state.secondAmount$,
            this.state.firstSymbol$,
            this.state.secondSymbol$
        )
        .pipe(
            debounceTime(700),
            filter(_ => this.typedIN !== InputUsedType.NONE),
            switchMap((_) => {
                return this.currencyAPI.getCourseOf(this.firstSymbol, this.secondSymbol)
            })
        )
        .subscribe((response) => {
            this.executeExchange(response.rates)
            this.typedIN = InputUsedType.NONE
        })
    }

    setInitialValues(state: IExchangeState) {
        this.state.firstAmount$.next(state.firstAmount)
        this.state.secondAmount$.next(state.secondAmount)
        this.state.firstSymbol$.next(state.firstSymbol)
        this.state.secondSymbol$.next(state.secondSymbol)
    }

    set firstSymbol(symbol: string) {
        this.typedIN = InputUsedType.FIRST
        this.state.firstSymbol$.next(symbol)
    }

    get firstSymbol() {
        return this.state.firstSymbol$.getValue()
    }

    set secondSymbol(symbol: string) {
        this.typedIN = InputUsedType.FIRST
        this.state.secondSymbol$.next(symbol)
    }

    get secondSymbol() {
        return this.state.secondSymbol$.getValue()
    }

    set secondAmount(amount: number) {
        if(!amount) {
            return
        }
        this.typedIN = InputUsedType.SECOND
        this.state.secondAmount$.next(+amount.toFixed(2))
    }

    get secondAmount() {
        return +this.state.secondAmount$.getValue().toFixed(2)
    }

    set firstAmount(amount: number) {
        if(!amount) {
            return
        }
        this.typedIN = InputUsedType.FIRST
        this.state.firstAmount$.next(+amount.toFixed(2))
    }

    get firstAmount() {
        return +this.state.firstAmount$.getValue().toFixed(2)
    }

    private executeExchange(rates:IRates) {
        if(this.typedIN === InputUsedType.FIRST) {
            const secondAmount = rates[this.secondSymbol] * this.firstAmount
            this.state.secondAmount$.next(secondAmount)
        } else {
            const firstAmount = (1 / rates[this.secondSymbol]) * this.secondAmount
            this.state.firstAmount$.next(firstAmount)
        }
    }
}