import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from "d3";
import { Subscription } from 'rxjs';

import { TwoStats } from 'src/app/shared/api-data.model';
import { ScatterPlotsService } from '../scatter-plots.service';

@Component({
    selector: 'app-scatter-plot',
    templateUrl: './scatter-plot.component.html',
    styleUrls: ['./scatter-plot.component.css']
})
export class ScatterPlotComponent implements OnInit, OnDestroy{
    @Input() public data: TwoStats;

    public svg: any;
    public noDataAvailable: boolean = false;
    private margin = { left: 100, right: 35, bottom: 50, top: 10 };
    private totalWidth: number = 1100;
    private totalHeight: number = 600;
    private dataSubscription: Subscription;
    private clearSubscription: Subscription;
    
    constructor(private scatterPlotService: ScatterPlotsService) {}

    ngOnInit(): void {
        this.initChart();
        
        this.dataSubscription = this.scatterPlotService.dataChanged.subscribe(
            (data: TwoStats[]) => {
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

        this.clearSubscription = this.scatterPlotService.graphCleared.subscribe(
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
            .domain([0, d3.max(this.data.data, (d) => d.stat2)]);

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
            .attr("y", innerHeight + this.margin.bottom)
            .style("text-anchor", "middle")
            // .attr("font-family", "ibm-plex-sans")
            .text(this.data.statistic1);

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
            .text(this.data.statistic2);

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
    }

    private clearChart(): void {
        this.svg.selectAll("g").remove();
        this.svg.selectAll("path").remove();
        this.svg.selectAll("text").remove();
    }
}