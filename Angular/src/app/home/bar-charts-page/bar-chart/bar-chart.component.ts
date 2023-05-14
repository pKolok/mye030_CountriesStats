import { Component, OnDestroy, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Subscription } from 'rxjs';

import { OneStat } from 'src/app/shared/api-data.model';
import { ChartsService } from '../../../shared/charts.service';
import { Colors } from 'src/app/shared/colors';

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, OnDestroy {
    public svg: any;
    public noDataAvailable: boolean = false;

    private data: OneStat[];
    private groupedData: any[] = [];
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
    private xScale: any;
    private xSubgroup: any;
    private yScale: any;
    private innerWidth: number;
    private innerHeight: number;
    private variableTopMargin: number;
    private statistics: string[] = [];
    
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

        this.statistics = Array.from(this.data.map(
            d => d.country + ": " + d.statistic));

        this.calculateXAxisDomain();
        this.calculateYAxisRange();
        this.specifyYLabelAndTitle();
        this.groupData();
        this.positionChartAccordingToData();
        this.setUpXAxis();
        this.setUpYAxis();
        this.setUpBars();
        this.setUpLegend();
        this.setUpTitle();
    }

    private clearChart(): void {
        this.svg.selectAll("g").remove();
        this.svg.selectAll("path").remove();
        this.svg.selectAll("text").remove();
    }

    private calculateXAxisDomain(): void {

        const yearsSet: Set<number> = new Set();

        this.data.forEach((data: OneStat) => {
            data.data.forEach(element => {
                yearsSet.add(element.year);
            });
        });

        this.allYears = Array.from(yearsSet).sort();
    }

    private calculateYAxisRange(): void {

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

        // All values are negative
        if (min < 0 && max <= 0) {
            this.yRange = [min, 0];

        } 
        // Values range from negative to positive
        else if (min < 0 && max > 0) {
            const absMax: number = Math.max(Math.abs(max), Math.abs(min));
            this.yRange = [-absMax, absMax];
        } 
        // All values are positive
        else {
            this.yRange = [0, max];
        }
    }

    // TODO: Common in 2. Inheritance?
    private specifyYLabelAndTitle(): void {
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

    private groupData(): any[] {

        this.groupedData = [];

        // Loop through statistics
        for (let year of this.allYears) {

            var newRecord = { year: year };

            for (let stat of this.data) {
                const record = stat.data.find(item => item.year === year);
                
                if (record) {
                    newRecord[stat.country + ": " + stat.statistic] 
                        = record.stat;
                }
            };
            
           this.groupedData.push(newRecord);
        }

        console.log(this.groupedData);

        return this.groupedData;
    }
    
    private positionChartAccordingToData(): void {

        const variableHeight = this.totalHeight + 30 * this.data.length;
        this.variableTopMargin = this.margin.top + 30 * this.data.length;

        // Width/height after subtracting x/y width/height
        this.innerWidth = this.totalWidth - this.margin.left 
            - this.margin.right;
        this.innerHeight = variableHeight - this.variableTopMargin 
            - this.margin.bottom;

        // Move the inner chart lower to account for number of lines
        this.svg = d3
            .select("svg")
            .attr("viewBox", `0 0 ${this.totalWidth} ${variableHeight}`)
            .select("g")
            .attr("transform", "translate(" + this.margin.left + "," + 
                this.variableTopMargin + ")");
    }

    private setUpXAxis(): void {
       
        // Set the scale
        this.xScale = d3
            .scaleBand()
            .range([0, this.innerWidth])
            .domain(this.allYears.map((d) => d.toString()))
            .padding(0.2);

        // Set X axis
        const ticks = this.allYears
            .map((d, i) => 
                (i == 1 || i % 5 == 0 || i == this.allYears.length - 1) ? 
                    d.toString() : undefined )
            .filter(item => item)
        const xAxis = d3
            .axisBottom(this.xScale)
            .tickSizeOuter(0)
            .tickValues(ticks);

        // Add X Axis
        this.svg
            .append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + this.innerHeight + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "translate(-12,10)rotate(-90)")
            .style("text-anchor", "end");
        
        // Add X Axis Label
        this.svg
            .append("text")
            .attr("x", this.innerWidth / 2)
            .attr("y", this.innerHeight + this.margin.bottom)
            .style("text-anchor", "middle")
            .text("Year")
            .style("fill", "black")
            .style("font-size", 15)
            .style("font-family", "Arial Black");              
        
        // Add Y Axis Label
        this.svg
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - this.margin.left)
            .attr("x", 0 - (this.innerHeight / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(this.yAxisLabel)
            .style("fill", "black")
            .style("font-size", 15)
            .style("font-family", "Arial Black");            

        // Another scale for subgroup position
        this.xSubgroup = d3
            .scaleBand()
            .domain(this.statistics)
            .range([0, this.xScale.bandwidth()])
            .padding(0.05);
    }

    private setUpYAxis(): void {
        
        // Set the scale
        this.yScale = d3
            .scaleLinear()
            .range([this.innerHeight, 0])
            .domain(this.yRange);

        // Set Y axis
        const yAxis = d3
            .axisLeft(this.yScale)
            .tickSizeOuter(0)
            .scale(this.yScale.nice());                 

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
            .attr("x", 0 - (this.innerHeight / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(this.yAxisLabel)
            .style("fill", "black")
            .style("font-size", 15)
            .style("font-family", "Arial Black");            

        // Y Gridlines
        d3.selectAll("g.yAxis g.tick")
            .append("line")
            .attr("class", "gridline")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", this.innerWidth)
            .attr("y2", 0)
            .attr("stroke", "#9ca5aecf") // line color
            .attr("stroke-dasharray","4") // make it dashed;
    }

    private setUpBars(): void {

        // Bars for positive values
        this.svg.append("g")
            .selectAll("g")
            .data(this.groupedData)
            .enter()
            .append("g")
            .attr("transform", d => 
                `translate(${this.xScale(d.year.toString())},0)`)
            .selectAll("rect")  // binding statistics to rectangles
            .data((d: any) => this.statistics.map(function(key) {
                    return { key: key, value: d[key] > 0 ? d[key] : 0 }; }))
            .enter()
            .append("rect")
            .attr("x", (d: any) => this.xSubgroup(d.key))
            .attr("width", this.xSubgroup.bandwidth())
            // setting up y coordinates and height position to 0 for transition
            .attr("y", (d: any) => this.yScale(0))
            .attr("height", (d: any) => 0)
            .attr("fill", (d: any, i: any) => this.colors[i])
            // setting up transition, delay and duration
            .transition()
            .delay((d: any) => Math.random() * 250)
            .duration(1000)
            // setting up normal values for y and height
            .attr("y", (d: any) => this.yScale(d.value))
            .attr("height", (d: any) => this.yScale(0) - this.yScale(d.value));

        // Bars for negative values
        this.svg.append("g")
            .selectAll("g")
            .data(this.groupedData)
            .enter()
            .append("g")
            .attr("transform", d => 
                `translate(${this.xScale(d.year.toString())},0)`)
            .selectAll("rect")  // binding statistics to rectangles
            .data((d: any) => this.statistics.map(function(key) {
                    return { key: key, value: d[key] < 0 ? d[key] : 0 }; }))
            .enter()
            .append("rect")
            .attr("x", (d: any) => this.xSubgroup(d.key))
            .attr("width", this.xSubgroup.bandwidth())
            // setting up y coordinates and height position to 0 for transition
            .attr("y", (d: any) => this.yScale(0))
            .attr("fill", (d: any, i: any) => this.colors[i])
            // setting up transition, delay and duration
            .transition()
            .delay((d: any) => Math.random() * 250)
            .duration(1000)
            // setting up normal values for y and height
            .attr("y", (d: any) => this.yScale(0))
            .attr("height", (d: any) => this.yScale(0) - this.yScale(-d.value));  
    }

    private setUpLegend(): void {

        //append legends
        var legend = this.svg
            .selectAll('g.legend')
            .data(this.data)
            .enter()
            .append("g");

        legend.append("circle")
            .attr("cx", 0)
            .attr('cy', (d, i) => - this.variableTopMargin + 50 + i * 30)
            .attr("r", 6)
            .style("fill", (d, i) => this.colors[i]);

        legend.append("text")
            .attr("x", 20)
            .attr("y", (d, i) => - this.variableTopMargin + 55 + i * 30)
            .text(d => d.country + ": " + d.statistic)
    }

    private setUpTitle(): void {
        this.svg
            .append("text")
            .attr("x", this.innerWidth / 2)
            .attr("y", - this.variableTopMargin + 15)
            .attr("text-anchor", "middle")
            .text(this.title)
            .style("fill", "black")
            .style("font-size", 20)
            .style("font-family", "Arial Black");
    }

}