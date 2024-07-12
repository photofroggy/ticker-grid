import { CompanyStock } from "../models/CompanyStock.js";
import { CompanyStocks } from "../models/CompanyStocks.js";

export class DeltaEmitter {
    $el: HTMLElement = document.createElement('div');

    addEventListener (event: string, listener: EventListenerOrEventListenerObject) {
        this.$el.addEventListener(event, listener);
    }

    removeEventListener (event: string, listener: EventListenerOrEventListenerObject) {
        this.$el.removeEventListener(event, listener);
    }

    async process (csv: string) {
        let current: CompanyStocks = [],
            lines = csv.split(/\r?\n/g),
            processLine = (line: string | null) => {
                if (line === null) {
                    lines = csv.split(/\r?\n/g);
                    processLine(lines.shift() ?? null);
                    return;
                }

                const findInterval = line.match(/^([0-9]+),,,,$/);

                if (findInterval === null) {
                    current.push(new CompanyStock(line.split(',')));
                    processLine(lines.shift() ?? null);
                    return;
                }

                this.$el.dispatchEvent(new CustomEvent<{ delta: CompanyStocks }>(
                    'delta',
                    {
                        bubbles: true,
                        cancelable: true,
                        detail: {
                            delta: [ ...current ],
                        }
                    }
                ));

                current = [];
                setTimeout(
                    () => processLine(lines.shift() ?? null),
                    parseInt(findInterval[1])
                );
            };

        processLine(lines.shift() ?? null);
    }
}

