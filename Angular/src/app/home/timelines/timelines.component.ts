import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { DBService } from "src/app/shared/db.service";
import * as d3 from "d3";

@Component({
    selector: "app-timelines",
    templateUrl: "./timelines.component.html",
    styleUrls: ["./timelines.component.css"]
})
export class TimelinesComponent implements OnInit {
    timelineForm: FormGroup = new FormGroup({});
    countries: string[] = [];
    statistics: string[] = ["Mid-Year Population", "Area"];
    selectedCountry = "";
    selectedStatistic = "";
    selectedData: { midyear_population: number, year: number }[] = [];
    isChartReady: boolean = false;

    constructor(private dbService: DBService) {}

    ngOnInit(): void {
        this.countries = this.dbService.getAllCountries();
        
        this.initForm();
    }

    onCountrySelected(event: any): void {
        this.selectedCountry = event.target.value;
        console.log(this.selectedCountry);
        this.isChartReady = false;
    }

    onStatisticSelected(event: any): void {
        this.selectedStatistic = event.target.value;
        console.log(this.selectedStatistic);
        this.isChartReady = false;
    }

    onSubmit(): void {
        console.log("Selected country: " + this.selectedCountry);
        console.log("Selected statistic: "+ this.selectedStatistic);

        this.dbService.getCountryStatistic(this.selectedCountry,
            this.selectedStatistic).subscribe((data: any) => {
            console.log(data);
            // this.createChart(data.data);
            this.selectedData = data.data;
            this.isChartReady = true;
      });
        
    }

    private initForm(): void {

        this.timelineForm = new FormGroup({
            "country": new FormControl(this.selectedCountry),
            "statistic": new FormControl(this.selectedStatistic)
        });
    }

    private createChart(data: any[]): void {
        let svg: any = "";
        const margin = 50;
        const width = 750 - (margin * 2);
        const height = 400 - (margin * 2);

        svg = d3.select("figure#timeline")
            .append("svg")
            .attr("width", width + (margin * 2))
            .attr("height", height + (margin * 2))
            .append("g")
            .attr("transform", "translate(" + margin + "," + margin + ")");

        // Create the X-axis band scale
        const x = d3.scaleTime()
        // const x = d3.scaleBand()
            .range([0, width])
            .domain(data.map((d) => d.year));

        // Draw the X-axis on the DOM
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));         

        // Create the Y-axis band scale
        const y = d3.scaleLinear()
            .range([height, 0])
            .domain(data.map((d) => d.midyear_population));

        // Draw the Y-axis on the DOM
        svg.append("g")
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(y));

        // Add the line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x((d: any) => x(d.year))
                .y((d: any) => y(d.midyear_population))
            );

    }
}
