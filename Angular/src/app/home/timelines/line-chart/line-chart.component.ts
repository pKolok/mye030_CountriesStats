import { Component, ElementRef, Input, OnChanges, OnInit } from "@angular/core";
import * as d3 from "d3";

@Component({
    selector: "app-line-chart",
    templateUrl: "./line-chart.component.html",
    styleUrls: ["./line-chart.component.css"]
})
export class LineChartComponent implements OnChanges {
    @Input() public data: { midyear_population: number, year: number }[] = [];

    private width = 700;
    private height = 700;
    private margin = 50;
    public svg: any;
    public svgInner: any;
    public yScale: any;
    public xScale: any;
    public xAxis: any;
    public yAxis: any;
    public lineGroup: any;
    
    public constructor(public chartElem: ElementRef) {}

    ngOnChanges(changes: any): void {
        if (changes.hasOwnProperty("data") && this.data) {
            this.initialiseChart();
            this.drawChart();

            window.addEventListener("resize", () => this.drawChart());
        }
    }

    private initialiseChart(): void {
        this.svg = d3
            // .select(this.chartElem.nativeElement)
            .select(".linechart")
            .append("svg")
            .attr("height", this.height);
        
        this.svgInner = this.svg
            .append("g")
            .style("transform", "translate(" + this.margin + "px, " + 
                this.margin + "px)");
        
        this.yScale = d3
            .scaleLinear()
            .domain([d3.max(this.data, (d) => d.midyear_population) + 1,
                d3.min(this.data, (d) => d.midyear_population) - 1])
            .range([0, this.height - 2 * this.margin]);

        this.yAxis = this.svgInner
            .append("g")
            .attr("id", "y-axis")
            .style("transform", "translate(" + this.margin + "px, 0)");

        this.xScale = d3
            .scaleTime()
            .domain(d3.extent(this.data, (d) => new Date(d.year, 6, 0)));

        this.xAxis = this.svgInner
            .append("g")
            .attr("id", "x-axis")
            .style("transform", "translate(0, " +
                (this.height - 2 * this.margin) + "px)");

        this.lineGroup = this.svgInner
            .append("g")
            .append("path")
            .attr("id", "line")
            .style("fill", "none")
            .style("stroke", "blue")
            .style("stroke-width", "2px");
    }

    private drawChart(): void {
        this.width = this.chartElem.nativeElement.getBoundingClientRect().width;
        this.svg
            .attr("width", this.width)

        this.xScale.range([this.margin, this.width - 2 * this.margin]);

        const noTicks = this.width < 700 ? 10 : 20;
        const xAxis = d3
            .axisBottom(this.xScale)
            .ticks(noTicks)
            .tickFormat(d3.timeFormat("%Y"));
        this.xAxis.call(xAxis);
        
        const yAxis = d3
            .axisLeft(this.yScale);
        this.yAxis.call(yAxis);

        const line = d3
            .line()
            .x((d) => d[0])
            .y((d) => d[1])
            .curve(d3.curveMonotoneX);

        const points: [number, number][] = this.data.map(
            (d) => [this.xScale(new Date(d.year, 6, 0)), 
                this.yScale(d.midyear_population)]
        );

        this.lineGroup.attr("d", line(points));
    }
}