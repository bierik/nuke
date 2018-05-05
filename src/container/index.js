import * as d3 from 'd3';


export function createContainer(target, { top = 0, left = 0 }) {
  const { width } = target.getBoundingClientRect();
  const container = d3
    .select(target)
    .append('svg')
    .attr('width', width);
  const g = container.append('g')
    .attr('transform', `translate(${left}, ${top})`);
  return { container, g };
}

export function adjustBounds(target, container) {
  const { width } = target.getBoundingClientRect();
  container
    .attr('width', width);
  return { width };
}

export function calcRangeWidth(target, margin) {
  return target.getBoundingClientRect().width - margin.left - margin.right;
}
