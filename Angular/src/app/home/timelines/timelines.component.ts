import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

import { DBService } from "src/app/shared/db.service";
import { ApiData } from "src/app/shared/api-data.model";

@Component({
    selector: "app-timelines",
    templateUrl: "./timelines.component.html",
    styleUrls: ["./timelines.component.css"]
})
export class TimelinesComponent implements OnInit {
    public timelineForm: FormGroup = new FormGroup({});
    public countries: string[] = [];
    public statistics: string[] = ["Mid-Year Population", "Area"];
    public selectedData: ApiData = null;
    public canSubmit: boolean = false;
    public canDrawChart: boolean = false;
    public noDataAvailable: boolean = false;
    private selectedCountry: string = "";
    private selectedStatistic: string = "";

    constructor(private dbService: DBService) {}

    ngOnInit(): void {
        this.countries = this.dbService.getAllCountries();
        this.initForm();
    }

    onCountrySelected(event: any): void {
        this.selectedCountry = event.target.value;

        if (this.selectedCountry === "Choose a Country") {
            this.selectedCountry = "";
        }

        if (this.selectedCountry && this.selectedStatistic) {
            this.canSubmit = true;
        } else {
            this.canSubmit = false;
        }
    }

    onStatisticSelected(event: any): void {
        this.selectedStatistic = event.target.value;

        if (this.selectedStatistic === "Choose a Statistic") {
            this.selectedStatistic = "";
        }

        if (this.selectedCountry && this.selectedStatistic) {
            this.canSubmit = true;
        } else {
            this.canSubmit = false;
        }
    }

    onSubmit(): void {
        this.dbService.getCountryStatistic(this.selectedCountry,
            this.selectedStatistic).subscribe((data: any) => {
                
            console.log(data);

            if (data.results > 0) {
                this.selectedData = data;
                this.noDataAvailable = false;
                this.canDrawChart = true;
            } else {
                this.noDataAvailable = true;
                this.canDrawChart = false;
            }
      });
        
    }

    onClear(): void {
        this.noDataAvailable = false;
        this.canDrawChart = false;
    }

    private initForm(): void {
        this.timelineForm = new FormGroup({
            "country": new FormControl(this.selectedCountry),
            "statistic": new FormControl(this.selectedStatistic)
        });
    }
}