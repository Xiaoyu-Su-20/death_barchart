import { select, selectAll, csv, scaleLinear, max, scaleBand, axisLeft, axisBottom } from 'd3';

// line variables
var line_added = false;

export function show_axis(svg, xAxis, yAxis, margin, HEIGHT){
    svg.append("g")
  .attr("class", "xAxis")
  .attr("transform", `translate (${margin.left}, ${HEIGHT - margin.bottom})`)
  .call(xAxis);
  svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate (${margin.left}, ${margin.top})`)
    .call(yAxis);
};

export const add_labels = ( {svg, WIDTH, HEIGHT, margin} ) => {
  svg.append("text") //xlabel
    .attr("class","label")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("transform", function(d,i){
      var xText = WIDTH/2;
      var yText = HEIGHT-1*margin.bottom/3;
      return "translate(" + xText + "," + yText + ") rotate(0)"
    })
    .text("Month");
  svg.append("text") //ylabel
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("transform", function(d,i){
        var xText = margin.left/3;
        var yText = HEIGHT/2;
        return "translate(" + xText + "," + yText + ") rotate(270)";
      })
      .text("Number of Deaths in Custody");
};

export const display_mean_line = ( {line_group, data, yScale} ) => {
			var death_count = d3.range(data.length)
			for (let i = 0; i < death_count.length; i++) {
			  death_count[i] = data[i]["value"]
			}
			const mean = d3.mean(death_count)
			 line_group.append("line")
  			.attr("class", "mean_line")
				.attr("x1",0).attr("x2",innerWidth)
				.attr("y1",yScale(mean) )
				.attr("y2",yScale(mean) )
			 const error = 2 * d3.deviation(death_count) / ((death_count.length-1)**0.5)
				line_group.append("line")
    		.attr("class", "error_line")
				.attr("x1",0).attr("x2",innerWidth)
				.attr("y1",yScale(mean - error))
				.attr("y2",yScale(mean - error))
				line_group.append("line")
    		.attr("class", "error_line")
				.attr("x1",0).attr("x2",innerWidth)
				.attr("y1",yScale(mean + error))
				.attr("y2",yScale(mean + error))
					// return d3.mean(vert_bardata.map(d => d.value))
};

export const remove_mean_line = ( {line_group} ) => {
    line_group.selectAll("line").remove()
};

export function change_data_ex(svg, xScale, yScale, xAxis, innerHeight, new_data, duration, delay=0) {
				//change the axis generator
				xScale.domain(new_data.map(d => d.key));
				// yScale.domain([0, d3.max(new_data, d => d.value)]);

				// change bars
				var  bars = svg
                    .select(".bars")
                    .selectAll("rect").data(new_data, d => d.key)
				bars.enter()
									.append("rect")
									.attr("x", (d, i) => xScale(d.key))
									.attr("y", d => yScale(d.value))
									.attr("width", xScale.bandwidth())
									.attr("height", d => innerHeight - yScale(d.value))
									.merge(bars)
									.transition().delay(delay).duration(duration).ease(d3.easeLinear)
								 .attr("x", (d, i) => xScale(d.key))
								 .attr("y", d => yScale(d.value))
								 .attr("width", xScale.bandwidth())
								 .attr("height", d => innerHeight - yScale(d.value));
				bars.exit()
					.remove()
				// change axis
				svg.select(".xAxis")
				.transition().duration(duration).ease(d3.easeLinear)
				.call(xAxis);
				// death_svg.select(".yAxis")
				// .transition().duration(duration).ease(d3.easeLinear)
				// .call(yAxis);
		};


export const change_data = ({svg, xScale, yScale, xAxis, innerHeight, new_data, duration, delay=0}) => {
				//change the axis generator
				xScale.domain(new_data.map(d => d.key));
				// yScale.domain([0, d3.max(new_data, d => d.value)]);

				// change bars
				var  bars = svg
                    .select(".bars")
                    .selectAll("rect").data(new_data, d => d.key)
				bars.enter()
									.append("rect")
									.attr("x", (d, i) => xScale(d.key))
									.attr("y", d => yScale(d.value))
									.attr("width", xScale.bandwidth())
									.attr("height", d => innerHeight - yScale(d.value))
									.merge(bars)
									.transition().delay(delay).duration(duration).ease(d3.easeLinear)
								 .attr("x", (d, i) => xScale(d.key))
								 .attr("y", d => yScale(d.value))
								 .attr("width", xScale.bandwidth())
								 .attr("height", d => innerHeight - yScale(d.value));
				bars.exit()
					.remove()
				// change axis
				svg.select(".xAxis")
				.transition().duration(duration).ease(d3.easeLinear)
				.call(xAxis);
				// death_svg.select(".yAxis")
				// .transition().duration(duration).ease(d3.easeLinear)
				// .call(yAxis);
		};
