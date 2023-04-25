import { Component, OnInit, ElementRef, Input } from "@angular/core";
import * as d3 from "d3";
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";

@Component({
    selector: "app-line-chart2",
    templateUrl: "./line-chart2.component.html",
    styleUrls: ["./line-chart2.component.css"]
})

export class LineChart2Component implements OnInit {
    @Input() public data: { midyear_population: number, year: number }[] = [];
    
    private svg: any;
    private htmlElement: HTMLElement;

    private margin = { top: 10, right: 10, bottom: 15, left: 65 };
    public width: number = 700;
    public height: number = 700;
    private x: any;
    private y: any;
    private line!: d3Shape.Line<[number, number]>; // this is line definition

    constructor(public elRef: ElementRef) {
        this.htmlElement = this.elRef.nativeElement;
    }

    ngOnInit(): void {
        this.buildSvg();
        this.updateGraphData();
    }

    /**
     * Configures the SVG element
     */
    private buildSvg(): void {
        const svgElement: any = this.htmlElement.getElementsByClassName("svg-chart")[0];
    
        // Do some automatic scaling for the chart
        this.width = svgElement.clientWidth - this.margin.left - 
            this.margin.right;
        this.height = svgElement.clientHeight * 0.90 - this.margin.top - 
            this.margin.bottom;
        this.svg = d3
            // .select(this.htmlElement)
            .select("svg")
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + 
                this.margin.top + ")");
        
        console.log(this.svg);

        this.svg
            // .append("text")
            // .text("Mid-year Population")
            .attr("y", "50%") // set the location of the text with respect to the y-axis
            .attr("x", "40%") // set the location of the text with respect to the x-axis
            .style("fill", "#0000AA") // set the font color
            .style("font-size", "2.3em")
            .style("font-weight", "bold")
            .attr("alignment-baseline", "middle")
            .attr("text-anchor", "middle");
    }

    public updateGraphData(): void {

        // Remove the current line form the chart
        this.clearChartData();
    
        // Configuring line path
        this.configureXaxis();
        this.configureYaxis();

        // Create the line for the chart and add it 
        this.drawLineAndPath();
    }

    /**
   * Removes all lines and axis from the chart so we can
   * create new ones based on the data
   */
    private clearChartData(): void {
        if (this.data !== null && this.data.length > 0) {
            this.svg.selectAll("g").remove();
            this.svg.selectAll("path").remove();
        }
    }
  
    private configureYaxis(): void {
    // range of data configuring
        const yRange: any[] = d3Array.extent(this.data, (d) => 
            d.midyear_population);
        // If we have data then make the Y range one less than the
        // smallest value so we have space between the bottom-most part
        // of the line and the X-axis
        if (yRange && yRange.length > 1
      && yRange[0] !== yRange[yRange.length - 1]) {
            yRange[0] -= 1;
        }
        this.y = d3Scale.scaleLinear()
            .range([this.height, 0])
            .domain(yRange);

        // Add the Y-axis definition to the left part of the chart
        this.svg.append("g")
            .attr("class", "axis axis--y")
            .call(d3Axis.axisLeft(this.y));
    }

    private configureXaxis(): void {
        const xRange: any[] = d3Array.extent(this.data, 
            (d) => new Date(d.year, 6, 0));
        // range of data configuring, in this case we are
        // showing data over a period of time
        this.x = d3Scale.scaleTime()
            .range([0, this.width])
            .domain(xRange);

        // Add the X-axis definition to the bottom of the chart
        this.svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3Axis.axisBottom(this.x));

    }

    private drawLineAndPath(): void {
        // Create a line based on the X and Y values (date and value)
        // from the data
        this.line = d3Shape.line()
            .x((d: any) => this.x(new Date(d.year, 6, 0)))
            .y((d: any) => this.y(d.midyear_population));

        // Configure the line's look and data source
        this.svg.append("path")
            .datum(this.data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", this.line);
    }

}