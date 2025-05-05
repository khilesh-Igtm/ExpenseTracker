import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BudgetVsExpenseChart = ({ budget, expense }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!budget && !expense) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    // Chart dimensions
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;

    // Create SVG container
    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Data for the chart
    const data = [
      { label: 'Budget', value: budget },
      { label: 'Expenses', value: expense },
    ].filter(d => d.value > 0); // Remove zero values for pie chart

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(['#10B981', '#EF4444']); // Vibrant green and red

    // Pie generator
    const pie = d3.pie()
      .sort(null)
      .value(d => d.value);

    // Arc generator
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    // Arc for labels
    const arcLabel = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.8);

    // Create pie chart
    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    // Draw pie slices
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('opacity', 0.9)
      .style('transition', 'transform 0.2s')
      .on('mouseover', function () {
        d3.select(this).style('transform', 'scale(1.05)');
      })
      .on('mouseout', function () {
        d3.select(this).style('transform', 'scale(1)');
      });

    // Add labels
    arcs.append('text')
      .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#fff')
      .style('font-weight', 'bold')
      .text(d => `${d.data.label}: $${d.data.value}`);

    // Title
    svg.append('text')
      .attr('y', -height / 2 + 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#1F2937')
      .text('Budget vs Expenses (Current Month)');

  }, [budget, expense]);

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
      <div ref={chartRef} className="mx-auto"></div>
    </div>
  );
};

export default BudgetVsExpenseChart;