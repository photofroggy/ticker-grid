import { CompanyStocks, companyStocksFromCsv } from "./models/CompanyStocks.js";
import { TickerPage } from "./ui/TickerPage.js";
import { DeltaEmitter } from "./controllers/DeltaEmitter.js";

document.addEventListener("DOMContentLoaded", async () => {
    const $app = document.querySelector('.app') ?? document.createElement('div');

    const deltaEmitter = new DeltaEmitter(),
        stocks: CompanyStocks = companyStocksFromCsv(
            await (await fetch('/csv/snapshot.csv')).text()
        ),
        tickerPage: TickerPage = new TickerPage($app, stocks);

    tickerPage.render();
    tickerPage.emitter(deltaEmitter);

    deltaEmitter.process(await (await fetch('/csv/deltas.csv')).text());
});
