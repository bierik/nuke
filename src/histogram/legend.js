import * as d3 from 'd3';
import { getColor } from '@/map';

export function createLegend(store, x = 0, y = 0) {
  const countries = store.getCountries();

  const legend = d3.create('svg:g');

  legend.attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('text-anchor', 'end')
    .selectAll('g')
    .data(countries.slice().reverse())
    .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(0,${20 * i})`);

  legend.selectAll('g')
    .append('rect')
    .attr('x', x)
    .attr('y', y)
    .attr('width', 19)
    .attr('height', 19)
    .attr('fill', getColor);

  legend.selectAll('g')
    .append('text')
    .attr('x', x - 5)
    .attr('y', y + 9.5)
    .attr('dy', '0.32em')
    .text(d => d);

  return legend;
}
