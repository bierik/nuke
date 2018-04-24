import * as d3 from 'd3';

export function createTimeline(data, container, margin) {
  const first = new Date(Number.parseInt(data[0].time, 10));
  const last = new Date(Number.parseInt(data[data.length - 1].time, 10));

  const timelineContainer = d3
    .select(container)
    .append('svg')
    .attr('width', '100%')
    .append('g');

  function draw() {
    const containerWidth = container.getBoundingClientRect().width;
    const scale = d3.scaleTime()
      .domain([first, last])
      .range([0, containerWidth - margin.left - margin.right])
      .nice();

    timelineContainer
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('width', containerWidth - margin.left - margin.right)
      .call(d3.axisBottom(scale));
  }

  return Object.freeze({ draw });
}
