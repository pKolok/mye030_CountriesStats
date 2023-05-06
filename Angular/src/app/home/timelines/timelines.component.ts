import { Component, OnInit } from "@angular/core";

import { DBService } from "src/app/shared/db.service";
import { ApiResponseData } from "src/app/shared/api-data.model";
import { TimelinesService } from "./timelines.service";
import { StatsChoiceService } from "../stats-choice.service";
import { StatisticChoice } from "../choose-statistic/statistic-choice.model";

@Component({
    selector: "app-timelines",
    templateUrl: "./timelines.component.html",
    styleUrls: ["./timelines.component.css"]
})
export class TimelinesComponent implements OnInit {
    public canSubmit: boolean = true;
    private selectedStatistic: StatisticChoice;

    constructor(private dbService: DBService, 
        private timelineService: TimelinesService,
        private statChoiceService: StatsChoiceService) {}

    ngOnInit(): void {
        this.statChoiceService.statisticSelected.subscribe(
            (statistic: StatisticChoice) => {
                this.selectedStatistic = statistic;
                this.canSubmit = true;
            });

        this.statChoiceService.statisticNotSelected.subscribe(() => {
            this.canSubmit = false;
        })
    }

    onSubmit(): void {
        var statisticName: string = this.selectedStatistic.statistic;

        if (this.selectedStatistic.age) {
            statisticName = statisticName.replace(
                " (by Age)", " at Age " + this.selectedStatistic.age);

            this.dbService.getCountryStatisticBySex(
                this.selectedStatistic.country, statisticName, 
                this.selectedStatistic.sex).subscribe(
                    (data: ApiResponseData) => {
                        
                    console.log(data);
        
                    delete data.status;
                    this.timelineService.setData([data]);
                });
            
            return;
        }

        // Case: Mid-Year Population by Age Group
        if (this.selectedStatistic.ageGroup) {
            statisticName = statisticName.replace(
                " (by Age Group)", " (" + this.selectedStatistic.sex + ")")

            var startingAge: string = "";
            if (this.selectedStatistic.ageGroup === "All Ages") {
                startingAge = "all";
            } else {
                startingAge = this.selectedStatistic.ageGroup
                    .replace("[", "")
                    .replace("]", "")
                    .split(",")[0];
            }

            this.dbService.getCountryStatisticByAgeGroup(
                this.selectedStatistic.country, statisticName, startingAge)
                .subscribe((data: ApiResponseData) => {
                        
                    console.log(data);
        
                    delete data.status;
                    this.timelineService.setData([data]);
                });
            
            return;
        }

        if (this.selectedStatistic.sex) {
            statisticName += " (" + this.selectedStatistic.sex + ")";
        }

        if (this.selectedStatistic.fertilityAgeGroup) {
            statisticName += " " + this.selectedStatistic.fertilityAgeGroup;
        }

        this.dbService.getCountryStatistic(this.selectedStatistic.country,
            statisticName).subscribe((data: ApiResponseData) => {            
                
            console.log(data);

            delete data.status;
            this.timelineService.setData([data]);
        });
    }

    onClear(): void {
        this.timelineService.clearGraph();
    }
}