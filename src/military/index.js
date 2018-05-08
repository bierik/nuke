import * as d3 from 'd3';
import { getColor } from '@/map';
import { createContainer, adjustBounds, calcRangeWidth } from '@/container';


export function craeteMilitaryChart(store, countryCode, target, margin) {
  const militaryExpenses = store.getMilitaryData(countryCode);

  const { container } = createContainer(target, margin);

  const height = 80;

  const x = d3
    .scaleTime()
    .domain(d3.extent(militaryExpenses, d => new Date(d.year, 0, 1)))
    .nice();

  const y = d3
    .scaleLinear()
    .range([height, 0])
    .domain(d3.extent(militaryExpenses, d => Number.parseInt(d.militaryExpenditures, 10)))
    .nice();

  const line = d3
    .line()
    .curve(d3.curveBasis)
    .x(d => x(new Date(d.year, 0, 1)))
    .y(d => y(d.militaryExpenditures));

  function draw() {
    adjustBounds(target, container, margin);

    const width = calcRangeWidth(target, margin);

    x.range([0, width]);

    container.selectAll('g').remove();

    container.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .append('path')
      .datum(militaryExpenses)
      .attr('fill', 'none')
      .attr('stroke', getColor(countryCode))
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    container
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(y).ticks(2, 's'));

    container
      .append('g')
      .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
      .call(d3.axisBottom(x).ticks(2));
  }

  return Object.freeze({ draw });
}
