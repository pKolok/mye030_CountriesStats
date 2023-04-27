import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import * as d3 from "d3";

import { DBService } from "src/app/shared/db.service";
import { ApiData } from "src/app/shared/api-data.model";

@Component({
    selector: "app-bar-charts",
    templateUrl: "./bar-charts.component.html",
    styleUrls: ["./bar-charts.component.css"]
})
export class BarChartsComponent {
    public barChartForm: FormGroup = new FormGroup({});
    public countries: string[] = [];
    public statistics: string[] = ["Mid-Year Population", "Area"];
    public canSubmit: boolean = false;
    public noDataAvailable: boolean = false;
    private selectedCountry = "";
    private selectedStatistic = "";
    private selectedData: ApiData;
    
    // Chart specific
    private svg: any;
    private margin = { left: 100, right: 10, bottom: 50, top: 10 };
    private totalWidth = 1100;
    private totalHeight = 600;

    constructor(private dbService: DBService) {}

    ngOnInit(): void {
        this.countries = this.dbService.getAllCountries();
        this.initForm();
        this.initChart();
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
            this.selectedStatistic).subscribe((data: ApiData) => {

            console.log(data);
            
            if (data.results > 0) {
                this.selectedData = data;
                this.noDataAvailable = false;
                this.createChart(this.selectedData.data);
            } else {
                this.noDataAvailable = true;
                this.clearChart();
            }
      });
    }

    onClear(): void {
        this.clearChart();
        this.noDataAvailable = false;
    }

    private initForm(): void {
        this.barChartForm = new FormGroup({
            "country": new FormControl(this.selectedCountry),
            "statistic": new FormControl(this.selectedStatistic)
        });
    }

    private initChart(): void {
        // Create svg
        this.svg = d3
            .select("figure#bar-chart")
            .append("svg")
            .attr("viewBox", `0 0 ${this.totalWidth} ${this.totalHeight}`)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + 
                this.margin.right + ")");
    }

    private createChart(data: any[]): void {

        // Width/height after subtracting x/y width/height
        const innerWidth = this.totalWidth - this.margin.left 
            - this.margin.right;
        const innerHeight = this.totalHeight - this.margin.top 
            - this.margin.bottom;

        // First clear possible pre-existing chart
        this.clearChart();

        // Set the scales
        const xScale = d3
            .scaleBand()
            .range([0, innerWidth])
            .domain(data.map((d) => d.year))
            .padding(0.3);
        const yScale = d3
            .scaleLinear()
            .range([innerHeight, 0])
            // .domain(d3.extent(data, (d) => d.midyear_population));
            .domain([0, d3.max(data, (d) => d.stat)]);

        // Set X axis
        const ticks = data
            .map((d, i) => i % 5 == 0 ? d.year : undefined)
            .filter(item => item)
        const xAxis = d3
            .axisBottom(xScale)
            .tickSizeOuter(0)
            .tickValues(ticks);
        // Set Y axis
        const yAxis = d3
            .axisLeft(yScale)
            .scale(yScale.nice());

        // Add X Axis
        this.svg
            .append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + innerHeight + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "translate(-12,10)rotate(-90)")
            .style("text-anchor", "end");
        // Add X Axis Label
        this.svg
            .append("text")
            .attr("x", innerWidth / 2)
            .attr("y", innerHeight + this.margin.bottom)
            .style("text-anchor", "middle")
            // .attr("font-family", "ibm-plex-sans")
            .text("Years");

        // Add Y axis
        this.svg
            .append("g")
            .attr("class", "yAxis")
            .call(yAxis);

        // Add Y Axis Label
        this.svg
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - this.margin.left)
            .attr("x", 0 - (innerHeight / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(this.selectedStatistic);

        // Y Gridlines
        d3.selectAll("g.yAxis g.tick")
            .append("line")
            .attr("class", "gridline")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", innerWidth)
            .attr("y2", 0)
            .attr("stroke", "#9ca5aecf") // line color
            .attr("stroke-dasharray","4") // make it dashed;;

        // Create and fill the bars
        this.svg.selectAll("bars")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d: any) => xScale(d.year))
            .attr("y", (d: any) => yScale(d.stat))
            .attr("width", xScale.bandwidth())
            .attr("height", (d: any) => innerHeight 
                - yScale(d.stat))
            .attr("fill", "#00A78F")
            // .transition()
            // .duration(250)
            // .delay((d, i) => i * 50)
            .attr("height", d => innerHeight - yScale(d.stat))
            .attr("y", d => yScale(d.stat));   
    }

    private clearChart(): void {
        this.svg.selectAll("g").remove();
        this.svg.selectAll("rect").remove();
        this.svg.selectAll("text").remove();
    }
}