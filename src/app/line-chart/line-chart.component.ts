import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  private margin = {top: 10, right: 30, bottom: 30, left: 60};
  private width = 460 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;
  private svg : any='';

// append the svg object to the body of the page
private createSvg(): void {
 this.svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", this.width + this.margin.left + this.margin.right)
  .attr("height", this.height + this.margin.top + this.margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");
 }
  constructor() { }
  private drawBars(data:any): void {
    
    var x = d3.scaleLinear()
        .domain([1,100])
        .range([ 0, this.width ]);
        this.svg.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(x));
    
      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, 13])
        .range([ this.height, 0 ]);
        this.svg.append("g")
        .call(d3.axisLeft(y));
       // This allows to find the closest X index of the mouse:
       var bisect = d3.bisector(function(d:any) { return d.x; }).left;
      // Create the circle that travels along the curve of chart
      var focus = this.svg
        .append('g')
        .append('circle')
          .style("fill", "yellow")
          .attr("stroke", "black")
          .attr('r', 4.5)
          .style("opacity", 1)

        // Create the text that travels along the curve of chart
      var focusText = this.svg
      .append('g')
      .append('text')
        .style("opacity", 1)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")


        this.svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d:any) { return x(d.x) })
          .y(function(d:any) { return y(d.y) })
          )


        // Create a rect on top of the svg area: this rectangle recovers mouse position
        this.svg
        .append('rect')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('width', this.width)
        .attr('height', this.height)
        .on('mouseover', mouseover)
        .on('mousemove',()=>{
           var x0 = x.invert(d3.mouse(d3.event.currentTarget)[0]);
          var i = bisect(data, x0, 1);
          var selectedData = data[i]
          focus
            .attr("cx", x(selectedData.x))
            .attr("cy", y(selectedData.y))
          focusText
            .html("x:" + selectedData.x + "  -  " + "y:" + selectedData.y)
            .attr("x", x(selectedData.x)+15)
            .attr("y", y(selectedData.y))
        })
        .on('mouseout', mouseout);
        // What happens when the mouse move -> show the annotations at the right positions.
        function mouseover() {
          focus.style("opacity", 1)
          focusText.style("opacity",1)
        }

        function mousemove() {
          // recover coordinate we need
         
          var x0 = x.invert(d3.pointer(Event)[0]);
          var i = bisect(data, x0, 1);
          var selectedData = data[i]
          console.log(selectedData.y)
          focus
            .attr("cx", x(selectedData.x))
            .attr("cy", y(selectedData.y))
          focusText
            .html("x:" + selectedData.x + "  -  " + "y:" + selectedData.y)
            .attr("x", x(selectedData.x)+15)
            .attr("y", y(selectedData.y))
          }
          function mouseout() {
            focus.style("opacity", 0)
            focusText.style("opacity", 0)
          }
        

  }


  ngOnInit(): void {
    this.createSvg();
    
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_IC.csv",
    (data)=> {return this.drawBars(data)}) 
  
  }

}
