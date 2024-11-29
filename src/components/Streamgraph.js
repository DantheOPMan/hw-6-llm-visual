// src/components/Streamgraph.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function Streamgraph({ data }) {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    // Dimensions
    const margin = { top: 20, right: 0, bottom: 30, left: 50 };
    const width = 400 - margin.left - margin.right; // Reduced width from 800 to 600
    const height = 500 - margin.top - margin.bottom;

    // Clear any existing content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up svg
    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse data
    const parseDate = d3.timeParse("%Y-%m-%d");

    data.forEach(d => {
      d.Date = parseDate(d.Date);
    });

    data.sort((a, b) => a.Date - b.Date);

    const keys = ["GPT-4", "Gemini", "PaLM-2", "Claude", "LLaMA-3.1"];
    const colors = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"];

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.Date))
      .range([0, width]);

    // Stack the data
    const stack = d3.stack()
      .keys(keys)
      .offset(d3.stackOffsetWiggle); // Use 'wiggle' for more extreme look

    const stackedData = stack(data);

    // Y scale domain
    const yExtent = [
      d3.min(stackedData, layer => d3.min(layer, d => d[0])),
      d3.max(stackedData, layer => d3.max(layer, d => d[1]))
    ];

    const yScale = d3.scaleLinear()
      .domain(yExtent)
      .range([height, 0]);

    // Area generator
    const area = d3.area()
      .x(d => xScale(d.data.Date))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(d3.curveBasis); // Smooth curves

    // Draw layers
    const layers = g.selectAll(".layer")
      .data(stackedData)
      .enter().append("path")
      .attr("class", "layer")
      .attr("d", area)
      .style("fill", (d, i) => colors[i])
      .on("mousemove", function(event, d) {
        const model = d.key;
        showTooltip(event, model);
      })
      .on("mouseout", function(event, d) {
        hideTooltip();
      });

    // Axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(d3.timeMonth.every(1))
      .tickFormat(d3.timeFormat("%b"));

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    // Tooltip functions (remain unchanged)
    function showTooltip(event, model) {
      const tooltip = d3.select(tooltipRef.current);
      tooltip.style("display", "block")
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY + 10}px`);

      drawMiniBarChart(model);
    }

    function hideTooltip() {
      const tooltip = d3.select(tooltipRef.current);
      tooltip.style("display", "none");
      tooltip.selectAll("*").remove();
    }

    function drawMiniBarChart(model) {
      const tooltip = d3.select(tooltipRef.current);
      tooltip.selectAll("*").remove(); // Clear previous content

      const miniWidth = 200;
      const miniHeight = 150;
      const miniMargin = { top: 20, right: 20, bottom: 30, left: 40 };

      const miniSvg = tooltip.append("svg")
        .attr("width", miniWidth)
        .attr("height", miniHeight);

      const miniG = miniSvg.append("g")
        .attr("transform", `translate(${miniMargin.left},${miniMargin.top})`);

      const miniXScale = d3.scaleBand()
        .domain(data.map(d => d.Date))
        .range([0, miniWidth - miniMargin.left - miniMargin.right])
        .padding(0.1);

      const miniYScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[model])])
        .range([miniHeight - miniMargin.top - miniMargin.bottom, 0]);

      // Add axes
      miniG.append("g")
        .attr("transform", `translate(0, ${miniHeight - miniMargin.top - miniMargin.bottom})`)
        .call(d3.axisBottom(miniXScale).tickFormat(d3.timeFormat("%b")));

      miniG.append("g")
        .call(d3.axisLeft(miniYScale));

      // Add bars
      miniG.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => miniXScale(d.Date))
        .attr("y", d => miniYScale(d[model]))
        .attr("width", miniXScale.bandwidth())
        .attr("height", d => miniHeight - miniMargin.top - miniMargin.bottom - miniYScale(d[model]))
        .attr("fill", colors[keys.indexOf(model)]);
    }

  }, [data]);

  return (
    <div style={{ position: "relative" }}>
      <svg ref={svgRef}></svg>
      <div className="tooltip" ref={tooltipRef}></div>
    </div>
  );
}

export default Streamgraph;
