import { Component, OnDestroy, OnInit } from "@angular/core";

import { DBService } from "src/app/shared/db.service";
import { ApiResponseData } from "src/app/shared/api-data.model";
import { TimelinesService } from "./timelines.service";
import { StatsChoiceService } from "../stats-choice.service";
import { StatisticChoice } from "../choose-statistic/statistic-choice.model";
import { Subscription, forkJoin } from "rxjs";

@Component({
    selector: "app-timelines",
    templateUrl: "./timelines.component.html",
    styleUrls: ["./timelines.component.css"]
})
export class TimelinesComponent implements OnInit, OnDestroy {
    public canSubmit: boolean = false;
    public noCountries: number = 1;

    private statisticSelectionSubscription: Subscription;
    private statisticDeselectionSubscription: Subscription;
    private selectedStatistics: StatisticChoice[];

    constructor(private dbService: DBService, 
        private timelineService: TimelinesService,
        private statChoiceService: StatsChoiceService) {}

    ngOnInit(): void {
        this.statisticSelectionSubscription =  this.statChoiceService
            .statisticsSelected.subscribe((statistics: StatisticChoice[]) => {
                this.selectedStatistics = statistics;
                this.canSubmit = true;
            });

        this.statisticDeselectionSubscription =  this.statChoiceService
            .statisticNotSelected.subscribe(() => {
                this.canSubmit = false;
        })
    }

    onAddCountry() {
        this.noCountries++;
        this.canSubmit = false;
    }

    onRemoveLastCountry() {
        this.noCountries--;
    }

    onSubmit(): void {

        const requests = {};

        // Put all requests in an array
        for (let selectedStatistic of this.selectedStatistics) {
            const statistic: string = selectedStatistic.statistic;
            requests[statistic] = this.chooseRequest(selectedStatistic);
        };

        // Wait for all requests to complete
        forkJoin(requests).subscribe((resData: [string, ApiResponseData]) => { 

            var apiData: ApiResponseData[] = [];

            Object.entries(resData).forEach((data: [string, ApiResponseData]) => {
                var apiResponse = data[1];
                delete apiResponse.status;
                apiData.push(apiResponse);
            });
            console.log(apiData);
            this.timelineService.setData(apiData);
        });
    }

    onClear(): void {
        this.timelineService.clearGraph();
    }

    ngOnDestroy(): void {
        this.statisticSelectionSubscription.unsubscribe();
        this.statisticDeselectionSubscription.unsubscribe();
    }

    private chooseRequest(selectedStatistic: StatisticChoice) {
        var statistic: string = selectedStatistic.statistic;
        const country: string = selectedStatistic.country;
        const age: string = selectedStatistic.age;
        const sex: string = selectedStatistic.sex;
        const ageGroup: string = selectedStatistic.ageGroup;
        const fertilityAgeGroup: string = selectedStatistic.fertilityAgeGroup;

        if (age) {
            statistic = statistic.replace(" (by Age)", " at Age " + age);
            return this.dbService.getCountryStatisticBySex(country,
                statistic, sex);           
        } else if (ageGroup) {
            // Case: Mid-Year Population by Age Group
            statistic = statistic.replace(" (by Age Group)", " (" + sex + ")");
            var startingAge: string = "";
            if (ageGroup === "All Ages") {
                startingAge = "all";
            } else {
                startingAge = ageGroup.replace("[", "").replace("]", "")
                    .split(",")[0];
            }
            return this.dbService.getCountryStatisticByAgeGroup(country,
                statistic, startingAge);
        } else {
            if (sex) {
                statistic += " (" + sex + ")";
            }
            if (fertilityAgeGroup) {
                statistic += " " + fertilityAgeGroup;
            }
            return this.dbService.getCountryStatistic(country, statistic);
        }
    }
}