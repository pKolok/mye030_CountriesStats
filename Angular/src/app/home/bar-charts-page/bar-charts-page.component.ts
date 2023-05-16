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
        private chartsService: ChartsService,
        private statChoiceService: ChooseStatisticService) {}

    // TODO: Common code - Inheritance?
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

    // TODO: Common code - Inheritance?
    onSubmit(): void {

        const requests = {};

        // Put all requests in an array
        for (let i = 0; i < this.selectedStatistics.length; ++i) {
            requests[i] = this.dbService.getStatistic(
                this.selectedStatistics[i]);
        };

        // Wait for all requests to complete
        forkJoin(requests).subscribe((resData: [string, ApiResponseData]) => { 

            var apiData: ApiResponseData[] = [];

            Object.entries(resData).forEach((data: [string, ApiResponseData]) => {
                var apiResponse = data[1];
                delete apiResponse.status;
                apiData.push(apiResponse);
            });
            this.chartsService.setData(apiData);
        });
    }

    // TODO: Common code - Inheritance?
    onClear(): void {
        this.chartsService.clearGraph();
    }

    // TODO: Common code - Inheritance?
    ngOnDestroy(): void {
        this.statisticSelectionSubscription.unsubscribe();
        this.statisticDeselectionSubscription.unsubscribe();
    }
    
}