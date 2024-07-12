import { DeltaEmitter } from "../controllers/DeltaEmitter.js";
import { CompanyStock, CompanyStockUpdates } from "../models/CompanyStock.js";
import { CompanyStocks } from "../models/CompanyStocks.js";

const emptyElement: HTMLElement = document.createElement('div');

export class TickerGrid {
    $container: Element;
    $grid: HTMLElement;
    stocks: CompanyStocks;

    constructor ($container: Element, stocks: CompanyStocks) {
        this.$container = $container;
        this.$grid = emptyElement;
        this.stocks = stocks;
    }

    emitter (emitter: DeltaEmitter) {
        emitter.addEventListener('delta', (event) => {
            const deltas: CompanyStocks = (event as CustomEvent)?.detail?.delta ?? [];
            deltas.forEach((delta: CompanyStock, row: number) =>
                this.apply(row, this.stocks[row]?.apply(delta) ?? [])
            );
        });
    }

    render () {
        this.$container.innerHTML = `
            <div class="ticker-grid">
                <div class="ticker-grid__heading"><h2>Name</h2></div>
                <div class="ticker-grid__heading"><h2>Company Name</h2></div>
                <div class="ticker-grid__heading"><h2>Price</h2></div>
                <div class="ticker-grid__heading"><h2>Change</h2></div>
                <div class="ticker-grid__heading"><h2>Chg %</h2></div>
                <div class="ticker-grid__heading"><h2>Mkt Cap</h2></div>
            </div>
        `;

        this.$grid = this.$container.querySelector('.ticker-grid') ?? emptyElement;

        this.stocks.forEach((companyStock: CompanyStock, index: number) =>
            companyStock.values.forEach((value: string, column: number) =>
                this.$grid.innerHTML+= `
                    <div class="ticker-grid__cell" data-row="${index}" data-column="${column}">${value}</div>
                `
            )
        );
    }

    apply (row: number, updates: CompanyStockUpdates) {
        updates.forEach(({ column, value }) => {
            const $cell = this.$grid
                .querySelector(`.ticker-grid__cell[data-row="${row}"][data-column="${column}"]`) as HTMLElement;
            if (!$cell) return;
            $cell.innerHTML = value;
            $cell.animate(
                [
                    {
                        backgroundColor: '#8bbfd7',
                        boxShadow: '0px 0px 5px 1px #35393c',
                        color: '#000000',
                    },
                    {
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0px 0px 5px 1px white',
                        color: '#000000',
                    },
                ],
                {
                    duration: 1000,
                    iterations: 1,
                }
            );
        });
    }
}
