import * as d3 from 'd3';
import { getColor } from '@/map';
import { yearToD3Time } from '@/utils';

const svgHeight = 500;
const margin = {
  top: 10, right: 50, bottom: 30, left: 50,
};

export function Histogram(store) {
  const countries = store.getCountries();
  const nukesPerYear = store.getNukesPerYear();

  let currentYear = nukesPerYear[0].year; // in d3 time

  const svg = d3.select('#histogram')
    .attr('width', '100%')
    .attr('height', svgHeight);

  function setCurrentYear(year) {
    currentYear = yearToD3Time(year);
  }

  function render() {
    svg.selectAll('*').remove();

    const svgWidth = svg.node().getBoundingClientRect().width;
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const x = d3.scaleTime()
      .domain(d3.extent(nukesPerYear, d => d.year))
      .range([0, width])
      .nice();

    const y = d3.scaleLinear()
      .domain([0, d3.max(nukesPerYear, d => d.total)])
      .range([height, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // stacked bars
    g.append('g')
      .selectAll('g')
      .data(d3.stack().keys(countries)(nukesPerYear))
      .enter()
      .append('g')
      .attr('fill', d => getColor(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('opacity', (d) => {
        // thanks to stupid linter: (d => d.data.year > currentYear ? 0.3 : 1) not allowed
        let opacity = 1;
        if (d.data.year > currentYear) {
          opacity = 0.3;
        }
        return opacity;
      })
      .attr('x', d => x(d.data.year))
      .attr('y', d => y(d[1]) || 0)
      .attr('height', d => y(d[0]) - y(d[1]) || 0)
      .attr('width', (width / nukesPerYear.length) * 0.7);

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

  return { render, setCurrentYear };
}
