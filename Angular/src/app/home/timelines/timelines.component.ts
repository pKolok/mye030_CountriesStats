import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

import { DBService } from "src/app/shared/db.service";
import { ApiResponseData } from "src/app/shared/api-data.model";
import { TimelinesService } from "./timelines.service";
import { Statistics } from "src/app/shared/statisticsList"

@Component({
    selector: "app-timelines",
    templateUrl: "./timelines.component.html",
    styleUrls: ["./timelines.component.css"]
})
export class TimelinesComponent implements OnInit {
    public timelineForm: FormGroup = new FormGroup({});
    public countries: string[] = [];
    public statistics: string[] = Statistics;
    public ages: number[] = [];
    public ageGroups: string[] = [];
    public fertilityAgeGroups: string[] = [];
    public sexes: string[] = [];
    public mustSelectSex: boolean = false;
    public mustSelectAge: boolean = false;
    public mustSelectAgeGroup: boolean = false;
    public mustSelectFertilityAgeGroup: boolean = false;
    public canSubmit: boolean = false;
    private selectedCountry: string = "";
    private selectedStatistic: string = "";
    private selectedSex: string = "Both Sexes";
    private selectedAge: string = "0";
    private selectedAgeGroup: string = "All Ages";
    private selectedFertilityAgeGroup: string = "Total";
    private statsRequiringTwoSexes: string[] = [];
    private statsRequiringThreeSexes: string[] = [];
    private statRequiringAge: string = "";
    private statRequiringAgeGroup: string = "";
    private statFertility: string = "";

    constructor(private dbService: DBService, 
        private timelineService: TimelinesService) {}

    ngOnInit(): void {
        this.countries = this.dbService.getAllCountries();

        // Build sexes
        this.sexes = ["Both Sexes", "Male", "Female"];

        // Build ages options
        this.ages = Array.from(Array(101).keys());

        // Build age group' options
        for (let i = 0; i < 100; i = i + 5) {
            this.ageGroups.push("[" + i + "," + (i + 4) + "]");
        }
        this.ageGroups.push("[100, )");

        // Build fertility age groups
        this.fertilityAgeGroups = ["Total", "[15-19]", "[20-24]", "[25-29]",
            "[30-34]", "[35-39]", "[40-44]", "[45-49]"];

        // Initialise stat filters
        this.statsRequiringTwoSexes = [
            "Mid-Year Population (by Age)",
            "Estimated Gross National Income per Capita"
        ];
        this.statsRequiringThreeSexes = [
            "Mid-Year Population (by Age Group)",
            "Infant Mortality Rate",
            "Life Expectancy at Birth",
            "Under-5 Mortality Rate",
            "Child Mortality Rate"
        ];
        this.statRequiringAge = "Mid-Year Population (by Age)";
        this.statRequiringAgeGroup = "Mid-Year Population (by Age Group)";
        this.statFertility = "Fertility Rate";
        
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
        this.mustSelectSex = false;
        this.mustSelectAge = false;
        this.mustSelectAgeGroup = false;
        this.mustSelectFertilityAgeGroup = false;

        this.selectedStatistic = event.target.value;

        if (this.selectedStatistic === "Choose a Statistic") {
            this.selectedStatistic = "";
            return;
        }

        // Check if user must be prompted to select sex
        if (this.statsRequiringTwoSexes.includes(this.selectedStatistic)) {
            this.mustSelectSex = true;
            this.sexes = ["Male", "Female"];
            this.timelineForm.patchValue({"sex": "Male"});
            this.selectedSex = "Male";
        }
        if (this.statsRequiringThreeSexes.includes(this.selectedStatistic)) {
            this.mustSelectSex = true;
            this.sexes = ["Both Sexes", "Male", "Female"];
            this.timelineForm.patchValue({"sex": "Both Sexes"});
            this.selectedSex = "Both Sexes";
        }

        // Check if user must be prompted to select age
        if (this.selectedStatistic === this.statRequiringAge) {
            this.mustSelectAge = true;
            this.timelineForm.patchValue({"age": "0"});
            this.selectedAge = "0";
        }
        
        // Check if user must be prompted to select age group
        if (this.selectedStatistic === this.statRequiringAgeGroup) {
            this.mustSelectAgeGroup = true;
            this.timelineForm.patchValue({"ageGroup": "All Ages"});
            this.selectedAgeGroup = "All Ages";
        }

        // Check if user must be prompted to select fertility age group
        if (this.selectedStatistic === this.statFertility) {
            this.mustSelectFertilityAgeGroup = true;
            this.timelineForm.patchValue({"fertilityAgeGroup": "Total"});
            this.selectedFertilityAgeGroup = "Total";
        }

        if (this.selectedCountry && this.selectedStatistic) {
            this.canSubmit = true;
        } else {
            this.canSubmit = false;
        }
    }

    onSexSelected(event: any): void {
        this.selectedSex = event.target.value;

        if (this.selectedCountry && this.selectedStatistic) {
            this.canSubmit = true;
        } else {
            this.canSubmit = false;
        }
    }

    onAgeSelected(event: any): void {
        this.selectedAge = event.target.value;
    }

    onAgeGroupSelected(event: any): void {
        this.selectedAgeGroup = event.target.value;
    }

    onFertilityAgeGroupSelected(event: any): void {
        this.selectedFertilityAgeGroup = event.target.value;
    }

    onSubmit(): void {

        var selectedStatistic: string = this.selectedStatistic;
        
        // Case: Mid-Year Population by Age
        if (this.mustSelectAge) {
            selectedStatistic = selectedStatistic.replace(" (by Age)", "");
            selectedStatistic += " at Age " + this.selectedAge;

            this.dbService.getCountryStatisticBySex(this.selectedCountry,
                selectedStatistic, this.selectedSex).subscribe(
                    (data: ApiResponseData) => {
                        
                    console.log(data);
        
                    delete data.status;
                    this.timelineService.setData([data]);
                });
            
            return;
        }

        // Case: Mid-Year Population by Age Group
        if (this.mustSelectAgeGroup) {
            selectedStatistic = selectedStatistic.replace(" (by Age Group)", "");
            selectedStatistic += " (" + this.selectedSex + ")";

            var startingAge: string = "";
            if (this.selectedAgeGroup === "All Ages") {
                startingAge = "all";
            } else {
                startingAge = this.selectedAgeGroup
                    .replace("[", "")
                    .replace("]", "")
                    .split(",")[0];
            }

            this.dbService.getCountryStatisticByAgeGroup(this.selectedCountry,
                selectedStatistic, startingAge).subscribe(
                    (data: ApiResponseData) => {
                        
                    console.log(data);
        
                    delete data.status;
                    this.timelineService.setData([data]);
                });
            
            return;
        }

        // Cases: Infant Mortality Rate, Life Expectancy at Birth etc.
        if (this.mustSelectSex) {
            selectedStatistic += " (" + this.selectedSex + ")";
        }

        if (this.mustSelectFertilityAgeGroup) {
            selectedStatistic += " " + this.selectedFertilityAgeGroup;
        }

        this.dbService.getCountryStatistic(this.selectedCountry,
            selectedStatistic).subscribe((data: ApiResponseData) => {
                
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
            "statistic": new FormControl(this.selectedStatistic),
            "sex": new FormControl(this.selectedSex),
            "age": new FormControl(this.selectedAge),
            "ageGroup": new FormControl(this.selectedAgeGroup),
            "fertilityAgeGroup": new FormControl(this.selectedAgeGroup)
        });
    }
}