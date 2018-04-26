import * as d3 from 'd3';
import { getColor } from '@/map';

const svgWidth = 1600;
const svgHeight = 500;

const svg = d3.select('#histogram')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

const margin = {
  top: 20, right: 20, bottom: 30, left: 100,
};
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;
const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

const x = d3.scaleTime()
  .rangeRound([0, width]);

const y = d3.scaleLinear()
  .rangeRound([height, 0]);

export default function renderHistogram(store) {
  const countries = store.getCountries();
  const histogramData = store.getNukesPerYear();

  x.domain(d3.extent(histogramData, d => d.year));
  y.domain([0, d3.max(histogramData, d => d.total)]).nice();

  // stacked bars
  g.append('g')
    .selectAll('g')
    .data(d3.stack().keys(countries)(histogramData))
    .enter()
    .append('g')
    .attr('fill', d => getColor(d.key))
    .selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
    .attr('x', d => x(d.data.year))
    .attr('y', d => y(d[1]) || 0)
    .attr('height', d => y(d[0]) - y(d[1]) || 0)
    .attr('width', 20);

  // x-axis
  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x)) // use .tick(value) to control the ticks..
    .select('.domain') // remove the lines...
    .remove();

  // y-axis
  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y).ticks(null, 's'));
    

  // legend
  const legend = g.append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('text-anchor', 'end')
    .selectAll('g')
    .data(countries.slice().reverse())
    .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(0,${20 * i})`);

  legend.append('rect')
    .attr('x', width - 19)
    .attr('width', 19)
    .attr('height', 19)
    .attr('fill', getColor);

  legend.append('text')
    .attr('x', width - 24)
    .attr('y', 9.5)
    .attr('dy', '0.32em')
    .text(d => d);
}
