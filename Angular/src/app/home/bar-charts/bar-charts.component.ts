import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { DBService } from "src/app/shared/db.service";
import * as d3 from "d3";

@Component({
    selector: "app-bar-charts",
    templateUrl: "./bar-charts.component.html",
    styleUrls: ["./bar-charts.component.css"]
})
export class BarChartsComponent {
    barChartForm: FormGroup = new FormGroup({});
    countries: string[] = [];
    statistics: string[] = ["Mid-Year Population", "Area"];
    selectedCountry = "";
    selectedStatistic = "";
    selectedData: { midyear_population: number, year: number }[] = [];
    canDrawChart: boolean = true;
    
    // Chart specific
    svg: any;
    // margin = 70;
    margin = { left: 100, right: 10, bottom: 50, top: 10 };
    totalWidth = 1100;
    totalHeight = 600;

    constructor(private dbService: DBService) {}

    ngOnInit(): void {
        this.countries = this.dbService.getAllCountries();
        
        this.initForm();
        this.initChart();
    }

    onCountrySelected(event: any): void {
        this.selectedCountry = event.target.value;
    }

    onStatisticSelected(event: any): void {
        this.selectedStatistic = event.target.value;
    }

    onSubmit(): void {
        this.dbService.getCountryStatistic(this.selectedCountry,
            this.selectedStatistic).subscribe((data: any) => {

            console.log(data);
            
            if (data.results > 0) {
                this.selectedData = data.data;
                this.canDrawChart = true;
                this.createChart(this.selectedData);
            } else {
                this.clearChart();
                this.canDrawChart = false;
            }
      });
    }

    onClear(): void {
        this.clearChart();
        this.canDrawChart = true;
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
        const x = d3
            .scaleBand()
            .range([0, innerWidth])
            .domain(data.map((d) => d.year))
            .padding(0.3);
        const y = d3
            .scaleLinear()
            .range([innerHeight, 0])
            // .domain(d3.extent(data, (d) => d.midyear_population));
            .domain([0, d3.max(data, (d) => d.midyear_population)]);

        // Set X axis
        const ticks = data
            .map((d, i) => i % 5 == 0 ? d.year : undefined)
            .filter(item => item)
        const xAxis = d3
            .axisBottom(x)
            .tickSizeOuter(0)
            .tickValues(ticks);
        // Set Y axis
        const yAxis = d3
            .axisLeft(y)
            .scale(y.nice());

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

        // d3.selectAll("g.xAxis g.tick")
        //     .append("line")
        //     .attr("class", "gridline")
        //     .attr("x1", 0)
        //     .attr("y1", -innerHeight)
        //     .attr("x2", 0)
        //     .attr("y2", 0)
        //     .attr("stroke", "#9ca5aecf") // line color
        //     .attr("stroke-dasharray","4") // make it dashed;


        // Create and fill the bars
        this.svg.selectAll("bars")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d: any) => x(d.year))
            .attr("y", (d: any) => y(d.midyear_population))
            .attr("width", x.bandwidth())
            .attr("height", (d: any) => innerHeight 
                - y(d.midyear_population))
            .attr("fill", "#00A78F")
            .transition()
            .duration(250)
            .delay((d, i) => i * 50)
            .attr("height", d => innerHeight - y(d.midyear_population))
            .attr("y", d => y(d.midyear_population));   
    }

    private clearChart(): void {
        this.svg.selectAll("g").remove();
        this.svg.selectAll("rect").remove();
        this.svg.selectAll("text").remove();
    }
}
