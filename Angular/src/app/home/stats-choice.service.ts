import { Injectable } from "@angular/core";
import { StatisticChoice } from "./choose-statistic/statistic-choice.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class StatsChoiceService {
    public statisticSelected = new Subject<StatisticChoice>();
    public statisticNotSelected = new Subject<boolean>();
    private statistic: StatisticChoice;
    
    setStatistic(newStatistic: StatisticChoice) {
        this.statistic = newStatistic;
        this.statisticSelected.next(this.statistic);
    }

    clearStatistic() {
        this.statisticNotSelected.next(true);
    }
}