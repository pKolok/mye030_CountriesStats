import { Component, OnDestroy, OnInit } from "@angular/core";
import * as d3 from "d3";
import { Subscription } from "rxjs";

import { OneStat } from "src/app/shared/api-data.model";
import { ChartsService } from "../../../shared/charts.service";
import { Colors } from "src/app/shared/colors";

@Component({
    selector: "app-line-chart",
    templateUrl: "./line-chart.component.html",
    styleUrls: ["./line-chart.component.css"]
})
export class LineChartComponent implements OnInit, OnDestroy {
    public svg: any;
    public noDataAvailable: boolean = false;

    private data: OneStat[];
    private margin = { left: 100, right: 20, bottom: 50, top: 40 };
    private totalWidth: number = 1100;
    private totalHeight: number = 600;
    private dataSubscription: Subscription;
    private clearSubscription: Subscription;
    private colors: string[] = Colors;
    private allYears: number[] = [];
    private yRange: number[] = [];
    private yAxisLabel: string = "";
    private title: string = "";
    
    constructor(private chartsService: ChartsService) {}

    ngOnInit(): void {
        this.initChart();

        this.dataSubscription = this.chartsService.dataChanged.subscribe(
            (data: OneStat[]) => {
                this.data = data;
                
                this.clearChart();

                this.noDataAvailable = true;
                for (let stat of this.data) {
                    if (stat.results > 0) {
                        this.noDataAvailable = false;
                        break;
                    }
                }

                this.setUpXAxis();
                this.setUpYAxis();
                this.setUpYLabelAndTitle();

                if ( !this.noDataAvailable ) {
                    this.createChart();
                }
            }
        );

        this.clearSubscription = this.chartsService.graphCleared.subscribe(
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
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + 
                this.margin.top + ")");
    }

    private createChart(): void {

        const variableHeight = this.totalHeight + 30 * this.data.length;
        const variableTopMargin = this.margin.top + 30 * this.data.length;

        // Width/height after subtracting x/y width/height
        const innerWidth = this.totalWidth - this.margin.left 
            - this.margin.right;
        const innerHeight = variableHeight - variableTopMargin 
            - this.margin.bottom;

        // Move the inner chart lower to account for number of lines
        this.svg = d3
            .select("svg")
            .attr("viewBox", `0 0 ${this.totalWidth} ${variableHeight}`)
            .select("g")
            .attr("transform", "translate(" + this.margin.left + "," + 
                variableTopMargin + ")");

        // Set the scales
        const xScale = d3
            .scaleTime()
            .range([0, innerWidth])
            .domain(d3.extent(this.allYears, (d) => new Date(d, 0, 0)));
        const yScale = d3
            .scaleLinear()
            .range([innerHeight, 0])
            .domain(this.yRange);

        // Set X axis
        const xAxis = d3
            .axisBottom(xScale)
            .scale(xScale.nice());
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
            // .style("stroke-width", "5px")
            .call(xAxis);
        // Add X Axis Label
        this.svg
            .append("text")
            .attr("x", innerWidth / 2)
            .attr("y", innerHeight + this.margin.bottom)
            .attr("text-anchor", "middle")
            .text("Year")
            .style("fill", "black")
            .style("font-size", 15)
            .style("font-family", "Arial Black");         

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
            .attr("text-anchor", "middle")
            .text(this.yAxisLabel)
            .style("fill", "black")
            .style("font-size", 15)
            .style("font-family", "Arial Black");

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
            .attr("stroke-dasharray","4") // make it dashed;

        // Iterate for number of lines
        for (let i = 0; i < this.data.length; ++i) {

            const line = d3.line()
                .x((d) => d[0])
                .y((d) => d[1])
                .curve(d3.curveMonotoneX);
    
            const points: [number, number][] = this.data[i].data.map(
                (d) => [xScale(new Date(d.year, 0, 0)), yScale(d.stat)]
            );
    
            const path = this.svg
                .append("path")
                .attr("d", line(points))
                .style("stroke-width", "2px")
                .style("fill", "none")
                .style("stroke", this.colors[i]);

            const length = path.node().getTotalLength(); // Get line length
    
            path
                .attr("stroke-dasharray", length + " " + length)
                .attr("stroke-dashoffset", length)
                .transition()
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0)
                .delay(100)         // delay to start drawing i.e 0.1s
                .duration(2000)     // duration of animation i.e. 2.0s
        }

        //append legends
        var legend = this.svg
            .selectAll('g.legend')
            .data(this.data)
            .enter()
            .append("g");

        legend.append("circle")
            .attr("cx", 0)
            .attr('cy', (d, i) => - variableTopMargin + 50 + i * 30)
            .attr("r", 6)
            .style("fill", (d, i) => this.colors[i]);

        legend.append("text")
            .attr("x", 20)
            .attr("y", (d, i) => - variableTopMargin + 55 + i * 30)
            .text(d => d.country + ": " + d.statistic)

        //append title
        this.svg
            .append("text")
            .attr("x", innerWidth / 2)
            .attr("y", - variableTopMargin + 15)
            .attr("text-anchor", "middle")
            .text(this.title)
            .style("fill", "black")
            .style("font-size", 20)
            .style("font-family", "Arial Black");
    }

    private clearChart(): void {
        this.svg.selectAll("g").remove();
        this.svg.selectAll("path").remove();
        this.svg.selectAll("text").remove();
    }

    private setUpXAxis(): void {

        const yearsSet: Set<number> = new Set();

        this.data.forEach((data: OneStat) => {
            data.data.forEach(element => {
                yearsSet.add(element.year);
            });
        });

        this.allYears = Array.from(yearsSet).sort();
    }

    private setUpYAxis(): void {

        var min: number = 99999999;
        var max: number = -99999999;

        this.data.forEach((data: OneStat) => {
            data.data.forEach(element => {
                if (element.stat > max) {
                    max = element.stat;
                }
                if (element.stat < min) {
                    min = element.stat;
                }
            });
        });

        this.yRange = [min, max];
    }

    private setUpYLabelAndTitle(): void {
        var statistic: string = this.data[0].statistic
            .replace("(Both Sexes) ", "")
            .replace("(Male) ", "")
            .replace("(Female) ", "");
        const cutOffIndex: number = statistic.indexOf('[');
        const description = statistic.substring(0, cutOffIndex - 1);
        const units = statistic.substring(cutOffIndex + 1, statistic.length - 1);

        if (this.data.length === 1) {
            this.title = description;
            this.yAxisLabel = units;
        } else {
            var variousStatistics: boolean = false;
            var previousStatistic = statistic;

            for (let part of this.data) {
                const stat: string = part.statistic
                    .replace("(Both Sexes) ", "")
                    .replace("(Male) ", "")
                    .replace("(Female) ", "");

                if (stat !== previousStatistic) {
                    variousStatistics = true;
                    break;
                }
                previousStatistic = stat;
            }

            if (variousStatistics) {
                this.title = "Various Statistics";
                this.yAxisLabel = "Various";
            } else {
                this.title = description;
                this.yAxisLabel = units;
            }
        }
    }

}