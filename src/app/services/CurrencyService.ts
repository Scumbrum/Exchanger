import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {  BehaviorSubject, catchError, EMPTY, finalize, map} from "rxjs";
import { ICourseResponse, ISymbolsResponse} from "../models/index";

@Injectable({
    providedIn: "root"
})
export default class CurrencyAPIService {
    private displayCurrency: string[] = [
        'USD',
        'EUR'
    ]

    private base ='UAH'
    private URL = 'https://fixer-fixer-currency-v1.p.rapidapi.com'

    private headers = {
        'X-RapidAPI-Key': '2f1e914af6msh75c8e00d67f3d4fp1a9e12jsn48266fbb62cb',
        'X-RapidAPI-Host': 'fixer-fixer-currency-v1.p.rapidapi.com'
    }

    private pendings$ = new BehaviorSubject<number>(0)

    loading$ = new BehaviorSubject<boolean>(false)
    error$ = new BehaviorSubject<string|null>(null)

    constructor(private http: HttpClient) {
        this.pendings$
        .subscribe((amount) => {
            if(amount > 0) {
                this.loading$.next(true)
            } else {
                this.loading$.next(false)
            }
        })
    }

    getAllSymbols() {
        this.pendings$.next(this.pendings$.getValue() + 1)
        this.error$.next(null)
        return this.http.get<ISymbolsResponse>(
            `${this.URL}/symbols`,
            {
                headers: this.headers
            }
        )
        .pipe(
            map((element) => {
                const symbols:string[] = []
                for(let symbol in element.symbols) {
                    symbols.push(symbol)
                }
                return symbols
            }),
            catchError(
                (error) => {
                    this.error$.next(error.message)
                    return EMPTY
                }
            ),
            finalize(() => {
                this.pendings$.next(this.pendings$.getValue() - 1)
            })
        )
    }

    getCourseOf(from: string, to: string) {
        this.pendings$.next(this.pendings$.getValue() + 1)
        this.error$.next(null)
        let params = new HttpParams(
            {
                fromObject: {
                    "base": from,
                    "symbols": to
                }
            }
        )
        return this.http.get<ICourseResponse>(
            `${this.URL}/latest`,
            {
                params: params,
                headers: this.headers
            }
        ).pipe(
            finalize(() => {
                this.pendings$.next(this.pendings$.getValue() - 1)
            }),
            catchError((error) => {
                this.error$.next(error.message)
                return EMPTY
            })
        )
    }
}