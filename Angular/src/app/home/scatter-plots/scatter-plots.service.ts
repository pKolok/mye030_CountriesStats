import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { TwoStats } from "src/app/shared/api-data.model";

@Injectable({ providedIn: 'root' })
export class ScatterPlotsService {
    public dataChanged = new Subject<TwoStats[]>();
    public graphCleared = new Subject();
    private data: TwoStats[] = [];

    setData(data: TwoStats[]) {
        this.data = data;
        this.dataChanged.next(this.data.slice());
    }

    clearGraph() {
        this.graphCleared.next(0);
    }
}