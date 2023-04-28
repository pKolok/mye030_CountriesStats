import { Component, Input, SimpleChanges } from '@angular/core';
import * as d3 from "d3";

import { TwoStats } from 'src/app/shared/api-data.model';

@Component({
    selector: 'app-scatter-plot',
    templateUrl: './scatter-plot.component.html',
    styleUrls: ['./scatter-plot.component.css']
})
export class ScatterPlotComponent {
    @Input() public data: TwoStats;

    public svg: any;
    private margin = { left: 100, right: 35, bottom: 50, top: 10 };
    private totalWidth = 1100;
    private totalHeight = 600;
    
    ngOnInit(): void {
        this.initChart();
        this.createChart();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.clearChart();
        this.createChart();
    }

    private initChart(): void {
        // Create svg
        this.svg = d3
            .select(".chart")
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

        // First clear possible pre-existing chart
        this.clearChart();

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
            .attr("y", innerHeight + this.margin.bottom / 2)
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
            .attr("r", 5)
            // .style("opacity", .8)
            .style("fill", "#328CC8");

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
            .style("opacity", .5)
            .style("font", "10px times");
    }

    private clearChart(): void {
        this.svg.selectAll("g").remove();
        this.svg.selectAll("path").remove();
        this.svg.selectAll("text").remove();
    }
}
