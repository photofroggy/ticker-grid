import { CompanyStock } from "./CompanyStock.js";

export type CompanyStocks = CompanyStock[];

export const companyStocksFromCsvLines = (lines: string[]): CompanyStocks =>
    lines.map((line: string) => new CompanyStock(line.split(',')));

export const companyStocksFromCsv = (csv: string): CompanyStocks =>
    companyStocksFromCsvLines(
        csv.split(/\r?\n/g)
            .slice(1)
            .filter((line: string) => line.length > 0));
