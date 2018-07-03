import * as d3 from 'd3';


export function createProgress(target, margin) {
  const progress = d3
    .select(target)
    .append('div')
    .style('margin-left', `${margin.left}px`)
    .style('width', `calc(100% - ${margin.right}px`);

  function set(value) {
    progress
      .style('transform', `scaleX(${value})`);
  }

  return Object.freeze({ set });
}
