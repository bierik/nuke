import * as d3 from 'd3';
import { createContainer, adjustBounds, calcRangeWidth } from '@/container';


export function createTimeline(data, target, margin) {
  const { container, g } = createContainer(target, margin);
  const x = d3.scaleTime()
    .domain(d3.extent(data, d => Number.parseInt(d.time, 10)))
    .nice();

  function draw() {
    adjustBounds(target, container, margin);
    const width = calcRangeWidth(target, margin);
    x.range([0, width]);
    g.call(d3.axisBottom(x));
  }

  return Object.freeze({ draw });
}
