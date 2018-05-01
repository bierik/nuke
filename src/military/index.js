import * as d3 from 'd3';
import { colorMap, getColor } from '@/map';
import { createContainer, adjustBounds, calcRangeWidth } from '@/container';
import groupBy from 'lodash.groupby';
import { appendYAxisLabel } from '@/axis';


export function craeteMilitaryChart(store, target, margin) {
  const militaryExpenses = store.getMilitaryData();

  const { container, g } = createContainer(target, margin);

  const expensesPerCountry = groupBy(militaryExpenses, 'country');
  const height = 80;

  const x = d3
    .scaleTime()
    .domain(d3.extent(militaryExpenses, d => Number.parseInt(d.year, 10)));

  const y = d3
    .scaleLinear()
    .range([height, 0])
    .domain(d3.extent(militaryExpenses, d => Number.parseInt(d.militaryExpenditures, 10)));

  const line = d3
    .line()
    .curve(d3.curveBasis)
    .x(d => x(d.year))
    .y(d => y(d.militaryExpenditures));

  function draw() {
    adjustBounds(target, container, margin);
    x.range([0, calcRangeWidth(target, margin)]);

    g.selectAll('g').remove();

    g
      .selectAll('g')
      .data(Object.keys(colorMap))
      .enter()
      .append('g')
      .append('path')
      .attr('d', d => line(expensesPerCountry[d]))
      .style('stroke', getColor);

    appendYAxisLabel(g.call(d3.axisLeft(y).ticks(4, 's')), 'Expenses ($)');
  }

  return Object.freeze({ draw });
}
