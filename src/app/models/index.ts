export interface IRates {
    [key: string]: number
}

export interface ICourseResponse {
    success: boolean,
    timestamp: number,
    base: string,
    date: string,
    rates: IRates
}

export interface ISymbols {
    [key: string]: string
}

export interface ISymbolsResponse {
    success: string,
    symbols: ISymbols
}

export enum InputUsedType {
    FIRST = "first",
    SECOND = "second",
    NONE = "none"
}

export interface IExchangeState {
    firstSymbol: string,
    secondSymbol: string,
    firstAmount: number,
    secondAmount: number
}