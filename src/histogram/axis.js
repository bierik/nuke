import * as d3 from 'd3';

export function createXAxis(scale, x = 0, y = 0, ticks = undefined) {
  const axis = d3.create('svg:g');

  axis.attr('transform', `translate(${x},${y})`)
    .call(d3.axisBottom(scale).ticks(ticks))
    .select('.domain') // remove the lines...
    .remove();

  return axis;
}

export function createYAxis(yAxis, x = 0, y = 0, text = '', ticks = undefined) {
  const axis = d3.create('svg:g');

  axis.attr('transform', `translate(${x},${y})`)
    .call(d3.axisLeft(yAxis).ticks(ticks, 's')) // controls the number of ticks
    .append('text')
    .attr('fill', '#000')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text(text);

  return axis;
}
