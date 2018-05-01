import { getColor, colorMap } from '@/map';
import * as d3 from 'd3';


export function createLegend(target) {
  const margin = {
    bottom: 20,
    left: 20,
  };

  const rect = {
    width: 20,
    height: 20,
  };

  const container = d3
    .select(target)
    .append('svg')
    .attr('width', 80)
    .attr('height', (Object.keys(colorMap).length * 20) + margin.bottom);

  container
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('text-anchor', 'end')
    .selectAll('g')
    .data(Object.keys(colorMap))
    .enter()
    .append('g')
    .attr('transform', (_, i) => `translate(${margin.left},${margin.bottom * i})`);

  container.selectAll('g')
    .append('rect')
    .attr('x', rect.width)
    .attr('y', rect.height)
    .attr('width', rect.width)
    .attr('height', rect.height)
    .attr('fill', getColor);

  container.selectAll('g')
    .append('text')
    .attr('x', rect.width - 5)
    .attr('y', rect.height + 9.5)
    .attr('dy', '0.32em')
    .text(d => d);

  return container;
}
