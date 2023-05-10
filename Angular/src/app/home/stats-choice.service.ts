import { Injectable } from "@angular/core";
import { StatisticChoice } from "./choose-statistic/statistic-choice.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class StatsChoiceService{
    public statisticsSelected: Subject<StatisticChoice[]> 
        = new Subject<StatisticChoice[]>();
    public statisticNotSelected: Subject<boolean> = new Subject<boolean>();

    private statistics: StatisticChoice[] = [];

    setStatistic(index: number, newStatistic: StatisticChoice) {
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