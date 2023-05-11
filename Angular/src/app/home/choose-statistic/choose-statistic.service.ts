import { Injectable } from "@angular/core";
import { Statistic } from "./statistic.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class ChooseStatisticService {
    public statisticsSelected: Subject<Statistic[]> = new Subject<Statistic[]>();
    public statisticNotSelected: Subject<boolean> = new Subject<boolean>();
    private statistics: Statistic[] = [];

    setStatistic(index: number, newStatistic: Statistic) {
        if (this.statistics.length <= index) {
            this.statistics.push(newStatistic);
        } else {
            this.statistics[index] = newStatistic;
        }
        this.statisticsSelected.next(this.statistics.slice());
    }

    resetStatistic(): void {
        this.statisticNotSelected.next(true);
    }

    clearStatistic(index: number) {
        this.statisticNotSelected.next(true);
    }

    deleteStatistic(index: number) {
        this.statistics.splice(index, 1);
        this.statisticsSelected.next(this.statistics.slice());
    }
}