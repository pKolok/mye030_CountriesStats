import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import * as d3 from "d3";

import { OneStat } from "src/app/shared/api-data.model";
import { TimelinesService } from "../timelines.service";
import { Subscription } from "rxjs";

@Component({
    selector: "app-line-chart",
    templateUrl: "./line-chart.component.html",
    styleUrls: ["./line-chart.component.css"]
})
export class LineChartComponent implements OnInit, OnDestroy {
    private data: OneStat;

    public svg: any;
    public noDataAvailable: boolean = false;
    private margin = { left: 100, right: 10, bottom: 50, top: 10 };
    private totalWidth = 1100;
    private totalHeight = 600;
    private dataSubscription: Subscription;
    private clearSubscription: Subscription;
    
    constructor(private timelineService: TimelinesService) {}

    ngOnInit(): void {
        this.initChart();

        this.dataSubscription = this.timelineService.dataChanged.subscribe(
            (data: OneStat[]) => {
                this.data = data[0];    // TODO - [0]: temp

                this.clearChart();
                if ( this.data.results > 0 ) {
                    this.noDataAvailable = false;
                    this.createChart();
                } else {
                    this.noDataAvailable = true;
                }
            }
        );

        this.clearSubscription = this.timelineService.graphCleared.subscribe(
            () => {
                this.clearChart();
                this.noDataAvailable = false;
            }
        );
    }

    ngOnDestroy(): void {
        this.dataSubscription.unsubscribe();
        this.clearSubscription.unsubscribe();
    }

    private initChart(): void {
        // Create svg
        this.svg = d3
            .select("figure#chart")
            .append("svg")
            .attr("viewBox", `0 0 ${this.totalWidth} ${this.totalHeight}`)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + 
                this.margin.right + ")");
    }

    private createChart(): void {

        // Width/height after subtracting x/y width/height
        const innerWidth = this.totalWidth - this.margin.left 
            - this.margin.right;
        const innerHeight = this.totalHeight - this.margin.top 
            - this.margin.bottom;

        // Set the scales
        const xScale = d3
            .scaleTime()
            .range([0, innerWidth])
            .domain(d3.extent(this.data.data, (d) => new Date(d.year, 6, 0)));

        const yScale = d3
            .scaleLinear()
            .range([innerHeight, 0])
            .domain([0, d3.max(this.data.data, (d) => d.stat)]);

        // Set X axis
        const xAxis = d3
            .axisBottom(xScale)
            .tickSizeOuter(0);
        // Set Y axis
        const yAxis = d3
            .axisLeft(yScale)
            .tickSizeOuter(0)
            .scale(yScale.nice());

        // Add X Axis
        this.svg
            .append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + innerHeight + ")")
            .call(xAxis);
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
            .text(this.data.statistic);

        // X Gridlines
        d3.selectAll("g.xAxis g.tick")
            .append("line")
            .attr("class", "gridline")
            .attr("x1", 0)
            .attr("y1", -innerHeight)
            .attr("x2", 0)
            .attr("y2", 0)
            .attr("stroke", "#9ca5aecf") // line color
            .attr("stroke-dasharray","4") // make it dashed;

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

        const line = d3
            .line()
            .x((d) => d[0])
            .y((d) => d[1])
            .curve(d3.curveMonotoneX);

        const points: [number, number][] = this.data.data.map(
            (d) => [xScale(new Date(d.year, 6, 0)), 
                yScale(d.stat)]
        );

        this.svg
            .append("g")
            .append("path")
            .attr("id", "line")
            .style("fill", "none")
            .style("stroke", "#328CC8")
            .style("stroke-width", "2px")
            .attr("d", line(points));
    }

    private clearChart(): void {
        this.svg.selectAll("g").remove();
        this.svg.selectAll("path").remove();
        this.svg.selectAll("text").remove();
    }
}