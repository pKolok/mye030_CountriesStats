import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { OneStat, TwoStats } from "src/app/shared/api-data.model";
import { DBService } from "src/app/shared/db.service";
import { ScatterPlotsService } from "./scatter-plots.service";

@Component({
    selector: "app-scatter-plots",
    templateUrl: "./scatter-plots.component.html",
    styleUrls: ["./scatter-plots.component.css"]
})
export class ScatterPlotsComponent {
    public timelineForm: FormGroup = new FormGroup({});
    public countries: string[] = [];
    public statistics: string[] = ["Mid-Year Population", "Total GDP"]; // TODO
    public canSubmit: boolean = false;
    private selectedCountry: string = "";
    private selectedStatistic1: string = "";
    private selectedStatistic2: string = "";

    constructor(private dbService: DBService, 
        private scatterPlotService: ScatterPlotsService) {}

    ngOnInit(): void {
        this.countries = this.dbService.getAllCountries();
        this.initForm();
    }

    onCountrySelected(event: any): void {
        this.selectedCountry = event.target.value;

        if (this.selectedCountry === "Choose a Country") {
            this.selectedCountry = "";
        }

        if (this.selectedCountry && this.selectedStatistic1 
            && this.selectedStatistic2) {
            this.canSubmit = true;
        } else {
            this.canSubmit = false;
        }
    }

    onStatistic1Selected(event: any): void {
        this.selectedStatistic1 = event.target.value;

        if (this.selectedStatistic1 === "Choose a Statistic") {
            this.selectedStatistic1 = "";
        }

        if (this.selectedCountry && this.selectedStatistic1 
            && this.selectedStatistic2) {
            this.canSubmit = true;
        } else {
            this.canSubmit = false;
        }
    }

    onStatistic2Selected(event: any): void {
        this.selectedStatistic2 = event.target.value;

        if (this.selectedStatistic2 === "Choose a Statistic") {
            this.selectedStatistic2 = "";
        }

        if (this.selectedCountry && this.selectedStatistic1 
            && this.selectedStatistic2) {
            this.canSubmit = true;
        } else {
            this.canSubmit = false;
        }
    }

    onSubmit(): void {
        this.dbService.getCountryStatistics(this.selectedCountry,
            this.selectedStatistic1, this.selectedStatistic2)
            .subscribe(([data1, data2]: [OneStat, OneStat]) => {
                
            console.log(data1);
            console.log(data2);

            // Keep only common years
            const data: TwoStats = this.saveCommonYears(data1, data2);

            console.log(data);

            this.scatterPlotService.setData([data]);
        });
    }

    onClear(): void {
        this.scatterPlotService.clearGraph();
    }

    private initForm(): void {
        this.timelineForm = new FormGroup({
            "country": new FormControl(this.selectedCountry),
            "statistic1": new FormControl(this.selectedStatistic1),
            "statistic2": new FormControl(this.selectedStatistic2)
        });
    }

    private saveCommonYears(data1: OneStat, data2: OneStat) {
        let records: { year: number, stat1: number, stat2: number }[] = [];

        for (let i = 0; i < data1.data.length; ++i) {
            const record1 = data1.data[i];

            const record2 = data2.data.find(
                item => item.year === record1.year);
            
            if (record2 && record1.stat && record2.stat) {
                records.push({ 
                    year: record1.year, 
                    stat1: record1.stat,
                    stat2: record2.stat
                });
            }
        }
        const data: TwoStats = {
            country: data1.country,
            statistic1: data1.statistic,
            statistic2: data2.statistic,
            results: records.length,
            data: records
        };
        return data;
    }
}