import * as d3 from 'd3';
import { getColor } from '@/map';

const svgWidth = 1600;
const svgHeight = 500;

const svg = d3.select('#military-expenditures')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

const margin = {
  top: 20, right: 20, bottom: 30, left: 100,
};
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;
const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

const parseTime = d3.timeParse('%Y');
const x = d3.scaleTime()
  .rangeRound([0, width]);

const y = d3.scaleLinear()
  .rangeRound([height, 0]);

const line = d3.line()
  .x(d => x(d.year))
  .y(d => y(d.militaryExpenditures));

function drawLine(data) {
  // line data values
  g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', getColor(data[0].country))
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 1.5)
    .attr('d', line); // define d3 line function and use it here..
}

export default function renderMilitaryExpenditures(data) {
  data.forEach((d) => {
    const year = parseTime(d.year);
    const militaryExpenditures = Number.parseInt(d.militaryExpenditures, 10);
    Object.assign(d, { year, militaryExpenditures });
  });

  // returns the minimum and maximum value in the given array
  x.domain(d3.extent(data, d => d.year));
  y.domain(d3.extent(data, d => d.militaryExpenditures));

  // x-axis
  // let xAxis = d3.axisBottom(x).ticks(15);

  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x)) // use .tick(value) to control the ticks..
    .select('.domain') // remove the lines...
    .remove();

  // y-axis
  g.append('g')
    .call(d3.axisLeft(y).ticks(5)) // controls the number of ticks
    .append('text')
    .attr('fill', '#000')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text('Price ($)');

  Object.values(data.reduce((acc, current) => {
    acc[current.country] = acc[current.country] || [];
    acc[current.country].push(current);
    return acc;
  }, {})).map(d => drawLine(d));
}
