import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { DBService } from "src/app/shared/db.service";

@Component({
    selector: "app-timelines",
    templateUrl: "./timelines.component.html",
    styleUrls: ["./timelines.component.css"]
})
export class TimelinesComponent implements OnInit {
    timelineForm: FormGroup = new FormGroup({});
    selectedCountry = "";
    selectedStatistic = "";
    countries: string[] = [];
    statistics: string[] = ["Mid-Year Population", "Area"];

    constructor(private dbService: DBService) {}

    ngOnInit(): void {
        this.countries = this.dbService.getAllCountries();
        
        this.initForm();
    }

    onCountrySelected(event: any): void {
        this.selectedCountry = event.target.value;
        console.log(this.selectedCountry);
    }

    onStatisticSelected(event: any): void {
        this.selectedStatistic = event.target.value;
        console.log(this.selectedStatistic);
    }

    onSubmit(): void {
        console.log("Selected country: " + this.selectedCountry);
        console.log("Selected statistic: "+ this.selectedStatistic);
    }

    private initForm(): void {

        this.timelineForm = new FormGroup({
            "country": new FormControl(this.selectedCountry),
            "statistic": new FormControl(this.selectedStatistic)
        });
    }
}
