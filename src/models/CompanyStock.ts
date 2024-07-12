
export type CompanyStockUpdate = { column: number, value: string }
export type CompanyStockUpdates = CompanyStockUpdate[];

export class CompanyStock {
    values: string[] = [ '', '', '', '', '', '' ];

    constructor (values: string[]) {
        this.values = values;
    }

    clone () {
        return new CompanyStock([ ...this.values ]);
    }

    apply (delta: CompanyStock | null): CompanyStockUpdates {
        let updates: CompanyStockUpdates = [];
        
        if (delta === null) return updates;
        if (delta.values.join('').length == 0) return updates;

        delta.values.forEach((value: string, column: number) => {
            if (value == '') return;
            if (value == this.values[column]) return;
            this.values[column] = value;
            updates.push({ column, value });
        });

        return updates;
    }
};

export const companyStockFromCsv = (csv: string): CompanyStock =>
    new CompanyStock(csv.split(','));
