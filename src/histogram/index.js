import * as d3 from 'd3';
import { colorMap, getColor } from '@/map';
import { createContainer, adjustBounds, calcRangeWidth } from '@/container';
import { appendYAxisLabel, horizontalGrid } from '@/axis';


export function createHistogram(store, target, margin) {
  const nukesPerYear = store.getNukesPerYear();

  const { container, g } = createContainer(target, margin);
  const height = 60;

  const x = d3.scaleBand()
    .domain(nukesPerYear.map(d => d.year))
    .paddingInner(0.1);

  const y = d3.scaleLinear()
    .domain(d3.extent(nukesPerYear.map(d => d.total)))
    .range([height, 0]);

  const stack = d3.stack().keys(Object.keys(colorMap))(nukesPerYear);

  appendYAxisLabel(g.call(d3.axisLeft(y).ticks(4, 's')), 'Nukes');

  function draw() {
    adjustBounds(target, container, margin);

    const width = calcRangeWidth(target, margin);

    x.range([0, width]);

    g.selectAll('g').remove();

    container.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(horizontalGrid(y, 4, width));

    // stacked bars
    g.selectAll('g')
      .data(stack)
      .enter()
      .append('g')
      .attr('fill', d => getColor(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', d => x(d.data.year))
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth());

    g.call(d3.axisLeft(y).ticks(4, 's'));
  }

  return Object.freeze({ draw });
}
