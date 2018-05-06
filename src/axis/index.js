import * as d3 from 'd3';


export function appendYAxisLabel(axis, text = '') {
  axis
    .append('text')
    .attr('fill', '#000')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text(text);

  return axis;
}

export function horizontalGrid(axis, ticks, tickSize) {
  return d3
    .axisLeft(axis)
    .ticks(5)
    .tickSize(-tickSize)
    .tickFormat('');
}
