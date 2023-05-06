import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Statistics } from '../../shared/statisticsList';
import { DBService } from '../../shared/db.service';
import { StatsChoiceService } from '../stats-choice.service';
import { StatisticChoice } from './statistic-choice.model';

@Component({
    selector: 'app-choose-statistic',
    templateUrl: './choose-statistic.component.html',
    styleUrls: ['./choose-statistic.component.css']
})
export class ChooseStatisticComponent implements OnInit {
    public timelineForm: FormGroup = new FormGroup({});     // TODO rename
    public countries: string[] = [];
    public statistics: string[] = Statistics;
    public ages: number[] = [];
    public ageGroups: string[] = [];
    public fertilityAgeGroups: string[] = [];
    public sexes: string[] = [];
    public selectedCountry: string = null;
    public selectedStatistic: string = null;
    public selectedSex: string = null;
    public selectedAge: string = null;
    public selectedAgeGroup: string = null;
    public selectedFertilityAgeGroup: string = null;
    private statsRequiringTwoSexes: string[] = [];
    private statsRequiringThreeSexes: string[] = [];
    private statRequiringAge: string = "";
    private statRequiringAgeGroup: string = "";
    private statFertility: string = "";

    constructor(private dbService: DBService, 
        private statChoiceService: StatsChoiceService) {}

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
            this.omitStatistic();
        } else {
            this.clearStatistic();
        }
    }

    onStatisticSelected(event: any): void {
        this.selectedStatistic = null;
        this.selectedSex = null;
        this.selectedAge = null;
        this.selectedAgeGroup = null;
        this.selectedFertilityAgeGroup = null;

        this.selectedStatistic = event.target.value;

        if (this.selectedStatistic === "Choose a Statistic") {
            this.selectedStatistic = null;
            return;
        }

        // Check if user must be prompted to select between two sexes
        if (this.statsRequiringTwoSexes.includes(this.selectedStatistic)) {
            this.sexes = ["Male", "Female"];
            this.timelineForm.patchValue({"sex": "Male"});
            this.selectedSex = "Male";
        }

        // Check if user must be prompted to select between three sexes
        if (this.statsRequiringThreeSexes.includes(this.selectedStatistic)) {
            this.sexes = ["Both Sexes", "Male", "Female"];
            this.timelineForm.patchValue({"sex": "Both Sexes"});
            this.selectedSex = "Both Sexes";
        }

        // Check if user must be prompted to select age
        if (this.selectedStatistic === this.statRequiringAge) {
            this.timelineForm.patchValue({"age": "0"});
            this.selectedAge = "0";
        }
        
        // Check if user must be prompted to select age group
        if (this.selectedStatistic === this.statRequiringAgeGroup) {
            this.timelineForm.patchValue({"ageGroup": "All Ages"});
            this.selectedAgeGroup = "All Ages";
        }

        // Check if user must be prompted to select fertility age group
        if (this.selectedStatistic === this.statFertility) {
            this.timelineForm.patchValue({"fertilityAgeGroup": "Total"});
            this.selectedFertilityAgeGroup = "Total";
        }

        if (this.selectedCountry && this.selectedStatistic) {
            this.omitStatistic();
        } else {
            this.clearStatistic();
        }
    }

    onSexSelected(event: any): void {
        this.selectedSex = event.target.value;

        if (this.selectedCountry && this.selectedStatistic) {
            this.omitStatistic();
        } else {
            this.clearStatistic();
        }
    }

    onAgeSelected(event: any): void {
        this.selectedAge = event.target.value;

        if (this.selectedCountry && this.selectedStatistic) {
            this.omitStatistic();
        } else {
            this.clearStatistic();
        }
    }

    onAgeGroupSelected(event: any): void {
        this.selectedAgeGroup = event.target.value;

        if (this.selectedCountry && this.selectedStatistic) {
            this.omitStatistic();
        } else {
            this.clearStatistic();
        }
    }

    onFertilityAgeGroupSelected(event: any): void {
        this.selectedFertilityAgeGroup = event.target.value;

        if (this.selectedCountry && this.selectedStatistic) {
            this.omitStatistic();
        } else {
            this.clearStatistic();
        }
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

    private omitStatistic(): void {
        this.statChoiceService.setStatistic(
            new StatisticChoice(
                this.selectedCountry,
                this.selectedStatistic,
                this.selectedSex,
                this.selectedAge,
                this.selectedAgeGroup,
                this.selectedFertilityAgeGroup));
    }

    private clearStatistic(): void {
        this.statChoiceService.clearStatistic();
    }
}