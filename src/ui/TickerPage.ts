import { DeltaEmitter } from "../controllers/DeltaEmitter.js";
import { CompanyStocks } from "../models/CompanyStocks.js";
import { TickerGrid } from "./TickerGrid.js";

const emptyElement: HTMLElement = document.createElement('div');

export class TickerPage {
    $container: Element;
    $selectFile: HTMLElement;
    $gridContainer: HTMLElement;
    $grid: TickerGrid;
    stocks: CompanyStocks;

    constructor ($container: Element, stocks: CompanyStocks) {
        this.$container = $container;
        this.$selectFile = emptyElement;
        this.$gridContainer = emptyElement;
        this.$grid = new TickerGrid(this.$container, stocks);
        this.stocks = stocks;
    }

    render () {
        this.$container.innerHTML = `
            <h1>Financial Ticker</h1>
            <div class="ticker-grid-container"></div>
        `;

        this.$gridContainer = this.$container.querySelector('.ticker-grid-container') ?? emptyElement;
        this.$grid = new TickerGrid(this.$gridContainer, this.stocks);
        this.$grid.render();
    }

    emitter (emitter: DeltaEmitter) {
        this.$grid.emitter(emitter);
    }
}
