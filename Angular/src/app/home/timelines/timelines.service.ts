import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { OneStat } from "src/app/shared/api-data.model";

@Injectable({ providedIn: 'root' })
export class TimelinesService {
    public dataChanged = new Subject<OneStat[]>();
    public graphCleared = new Subject();
    private data: OneStat[] = [];

    setData(data: OneStat[]) {
        this.data = data;
        this.dataChanged.next(this.data);
        console.log(this.data);
    }

    clearGraph() {
        this.graphCleared.next(0);
    }

}