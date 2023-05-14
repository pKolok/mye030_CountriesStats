import { Component, OnDestroy, OnInit } from '@angular/core';
import * as d3 from "d3";
import { Subscription } from 'rxjs';

import { OneStat, TwoStats } from 'src/app/shared/api-data.model';
import { ChartsService } from 'src/app/shared/charts.service';

@Component({
    selector: 'app-scatter-plot',
    templateUrl: './scatter-plot.component.html',
    styleUrls: ['./scatter-plot.component.css']
})
export class ScatterPlotComponent implements OnInit, OnDestroy{
    public svg: any;
    public noDataAvailable: boolean = false;

    private data: TwoStats;
    private margin = { left: 100, right: 35, bottom: 50, top: 40 };
    private totalWidth: number = 1100;
    private totalHeight: number = 600;
    private dataSubscription: Subscription;
    private clearSubscription: Subscription;
    private title: string = "";
    
    constructor(private chartsService: ChartsService) {}

    ngOnInit(): void {
        this.initChart();
        
        this.dataSubscription = this.chartsService.dataChanged.subscribe(
            (data: OneStat[]) => {

                this.clearChart();

                this.noDataAvailable = false;
                for (let stat of data) {
                    if (stat.results === 0) {
                        this.noDataAvailable = true;
                        break;
                    }
                }

                this.data = this.saveCommonYears(data[0], data[1]);
                this.setUpTitle();

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
            .attr("viewBox", `0 0 ${this.totalWidth} ${this.totalHeight}`)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + 
                this.margin.top + ")");
    }

    private createChart(): void {

        // Width/height after subtracting x/y width/height
        const innerWidth = this.totalWidth - this.margin.left 
            - this.margin.right;
        const innerHeight = this.totalHeight - this.margin.top 
            - this.margin.bottom;

        // Set the scales
        const xScale = d3
            .scaleLinear()
            .range([0, innerWidth])
            .domain(d3.extent(this.data.data, (d) => d.stat1));

        const yScale = d3
            .scaleLinear()
            .range([innerHeight, 0])
            .domain(d3.extent(this.data.data, (d) => d.stat2));

        // Set X axis
        const xAxis = d3
            .axisBottom(xScale)
            .scale(xScale.nice());
        // Set Y axis
        const yAxis = d3
            .axisLeft(yScale)
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
            .attr("y", innerHeight + this.margin.bottom * 3 / 4)
            .style("text-anchor", "middle")
            .text(this.data.country1 + ": " + this.data.statistic1)
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
            .style("text-anchor", "middle")
            .text(this.data.country2 + ": " + this.data.statistic2)
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
            .attr("stroke-dasharray","4") // make it dashed;;

        // Add dots
        const dots = this.svg.append('g');
        dots
            .selectAll("dot")
            .data(this.data.data)
            .enter()
            .append("circle")
            .attr("cx", (d: any) => xScale(d.stat1))
            .attr("cy",  (d: any) => yScale(d.stat2))
            .attr("r", 0)
            .style("fill", "#328CC8")
            .transition()
            .delay((d, i) => i * 60)
            .attr("r", 5);

        // Add labels
        dots
            .selectAll("text")
            .data(this.data.data)
            .enter()
            .append("text")
            .text( (d: any) => d.year)
            .attr("x", (d: any) => xScale(d.stat1))
            .attr("y", (d: any)  => yScale(d.stat2))
            .attr("transform", "translate(5,-2)")
            .style("opacity", .0)   // transition opacity from 0 to 0.5
            .transition()
            .delay(500)
            .duration(3500)
            .style("opacity", .5)
            .style("font", "10px times");

        //append title
        this.svg
            .append("text")
            .attr("x", innerWidth / 2)
            .attr("y", - this.margin.top + 15)
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

    private setUpTitle(): void {
        const statistic1: string = this.data.statistic1
            .replace("(Both Sexes) ", "")
            .replace("(Male) ", "")
            .replace("(Female) ", "");
        const cutOffIndex1: number = statistic1.indexOf('[');
        const xDescription = statistic1.substring(0, cutOffIndex1 - 1);

        const statistic2: string = this.data.statistic2
            .replace("(Both Sexes) ", "")
            .replace("(Male) ", "")
            .replace("(Female) ", "");
        const cutOffIndex2: number = statistic2.indexOf('[');
        const yDescription = statistic2.substring(0, cutOffIndex2 - 1);

        this.title = this.data.country1 + ": " + xDescription + " vs " 
            + this.data.country2 + ": " + yDescription;
    }

    private saveCommonYears(data1: OneStat, data2: OneStat): TwoStats {

        let records: { year: number, stat1: number, stat2: number }[] = [];

        for (let i = 0; i < data1.data.length; ++i) {
            const record1 = data1.data[i];

            const record2 = data2.data.find(
                item => item.year === record1.year);
            
            if (record2 && record1.stat && record2.stat) {
                records.push({ 
                    year: record1.year, 
                    stat1: record1.stat,
                    stat2: record2.stat
                });
            }
        }
        const data: TwoStats = {
            country1: data1.country,
            country2: data2.country,
            statistic1: data1.statistic,
            statistic2: data2.statistic,
            results: records.length,
            data: records
        };
        return data;
    }

}