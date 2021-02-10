import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { select, selectAll, csv, scaleLinear, max, scaleBand, axisLeft, axisBottom } from 'd3'; 
import { useData } from './useData';
import { show_axis, add_labels, display_mean_line, remove_mean_line, change_data_ex} from './functions';


let line_added = false;
  
//svg constants
const svg = d3.select('svg#death_svg');
const WIDTH = parseFloat(svg.attr('width'));
const HEIGHT= parseFloat(svg.attr('height'));
const margin={top: 50, right: 10, bottom: 50, left: 40};
const innerWidth = WIDTH - margin.left - margin.right;
const innerHeight = HEIGHT - margin.top - margin.bottom;

// bar constants 
const barAdjust = 0; //this is used to change the width of the bar while centered 

// transition  
const DURATION = 2000;
const DELAY = 100;


const App = () => {
  
  const data = useData();
  if (!data) {
    return <pre>Loading...</pre>;
  }
  console.log(data);

  const xScale = d3.scaleBand()
         .domain(data.map(d => d.key))
         .range([0, innerWidth])
         .paddingInner([.2]);

  const yScale = d3.scaleLinear()
     .domain([0, d3.max(data, d => d.value)])
      .range([innerHeight, 0])
      .nice();
  
  const xAxis = d3.axisBottom().scale(xScale);
  const yAxis = d3.axisLeft().scale(yScale);  
  
  // show axis
  show_axis(svg, xAxis, yAxis, margin, HEIGHT);
  
  // add and show bars 
  const bars = svg.append('g')
												.attr("class", "bars")
												.attr("transform", `translate (${margin.left}, ${margin.top})`)
												.selectAll("rect")
												.data(data, d => d.key);
  bars.enter().append("rect")
        .attr("x", (d, i) => xScale(d.key)+barAdjust)
        .attr("y", d => yScale(d.value))
        .attr("width", xScale.bandwidth()-barAdjust*2)
        .attr("height", d => innerHeight - yScale(d.value));
  // labels
	add_labels({svg, WIDTH, HEIGHT, margin}); 
  
  // mean line
  const line_group = svg.append("g") //initiate
                       .attr("class","line_group")
                       .attr("transform", `translate (${margin.left}, ${margin.top})`)
  const toggle_line = () => {
      if (line_added == true) {
        remove_mean_line({line_group});
        line_added = false;
      } else {
        display_mean_line({line_group, data, yScale});
        line_added = true;
      }
    };

  // bar transition
  function bar_transition() {
    const new_data = JSON.parse(JSON.stringify(data))
    for (let i = 0; i < new_data.length; i++) {
      new_data[i]["value"] = 10
    }
		change_data_ex(svg, xScale, yScale, xAxis,innerHeight,new_data)
		change_data_ex(svg, xScale, yScale, xAxis,innerHeight,data,DURATION,DELAY)
  };
  
  bar_transition();
  
  return (
    <>
    <div class='button-container'>
				<button class='buttons' id='add_mean' onClick={toggle_line}>
          Mean
      </button>
				<button class='buttons' id='bar_transition' onClick={bar_transition}>Transition</button>
		</div>
    </>
  );
};



const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);