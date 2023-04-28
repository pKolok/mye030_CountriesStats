import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

import { DBService } from "src/app/shared/db.service";
import { ApiResponseData } from "src/app/shared/api-data.model";
import { TimelinesService } from "./timelines.service";

@Component({
    selector: "app-timelines",
    templateUrl: "./timelines.component.html",
    styleUrls: ["./timelines.component.css"]
})
export class TimelinesComponent implements OnInit {
    public timelineForm: FormGroup = new FormGroup({});
    public countries: string[] = [];
    public statistics: string[] = ["Mid-Year Population", "Area"];  // TODO
    public canSubmit: boolean = false;
    private selectedCountry: string = "";
    private selectedStatistic: string = "";

    constructor(private dbService: DBService, 
        private timelineService: TimelinesService) {}

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
            this.selectedStatistic).subscribe((data: ApiResponseData) => {
                
            console.log(data);

            delete data.status;
            this.timelineService.setData([data]);
      });
    }

    onClear(): void {
        this.timelineService.clearGraph();
    }

    private initForm(): void {
        this.timelineForm = new FormGroup({
            "country": new FormControl(this.selectedCountry),
            "statistic": new FormControl(this.selectedStatistic)
        });
    }
}