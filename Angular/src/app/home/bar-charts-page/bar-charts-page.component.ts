import { Component } from "@angular/core";

import { DBService } from "src/app/shared/db.service";
import { ApiResponseData } from "src/app/shared/api-data.model";
import { Subscription, forkJoin } from "rxjs";
import { Statistic } from "../choose-statistic/statistic.model";
import { ChartsService } from "../../shared/charts.service";
import { ChooseStatisticService } from "../choose-statistic/choose-statistic.service";

@Component({
    selector: "app-bar-charts-page",
    templateUrl: "./bar-charts-page.component.html",
    styleUrls: ["./bar-charts-page.component.css"]
})
export class BarChartsPageComponent {
    public canSubmit: boolean = false;
    public noCountries: number = 1;
    public maxCountries: number = 5;

    private statisticSelectionSubscription: Subscription;
    private statisticDeselectionSubscription: Subscription;
    private selectedStatistics: Statistic[];

    constructor(private dbService: DBService, 
        private timelineService: ChartsService,
        private statChoiceService: ChooseStatisticService) {}

    ngOnInit(): void {
        this.statisticSelectionSubscription =  this.statChoiceService
            .statisticsSelected.subscribe((statistics: Statistic[]) => {
                this.selectedStatistics = statistics;
                this.canSubmit = true;
        });

        this.statisticDeselectionSubscription =  this.statChoiceService
            .statisticNotSelected.subscribe(() => {
                this.canSubmit = false;
        })
    }

    onAddCountry() {
        if (this.noCountries < this.maxCountries) {
            this.noCountries++;
            this.canSubmit = false;
        }
    }

    onRemoveLastCountry() {
        if (this.noCountries === 1) {
            return;
        } 
        this.noCountries--;
    }

    onSubmit(): void {

        const requests = {};

        // Put all requests in an array
        for (let i = 0; i < this.selectedStatistics.length; ++i) {
            const statistic: string = this.selectedStatistics[i].statistic;
            requests[i] = this.chooseRequest(this.selectedStatistics[i]);
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

    private chooseRequest(selectedStatistic: Statistic) {
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