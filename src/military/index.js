import * as d3 from 'd3';
import { getColor } from '@/map';
import { createContainer, adjustBounds, calcRangeWidth } from '@/container';
import groupBy from 'lodash.groupby';
import mapValues from 'lodash.mapvalues';


export function craeteMilitaryChart(store, countryCode, target, margin) {
  const nukesPerYear = store.getNukesPerYear();
  const militaryExpenses = store.getMilitaryData(countryCode);
  const nukesByCountry = store.nukesByCountry(countryCode);
  const nukesPerYearCount = mapValues(
    groupBy(nukesByCountry, d => new Date(Number.parseInt(d.time, 10)).getFullYear()),
    d => d.length,
  );

  const listNukesPerYear = Object
    .keys(nukesPerYearCount)
    .map(d => ({ year: d, amount: nukesPerYearCount[d] }));

  const { container } = createContainer(target, margin);

  const height = 80;

  const xExpenses = d3
    .scaleTime()
    .domain(d3.extent(militaryExpenses, d => new Date(d.year, 0, 1)))
    .nice();

  const yExpenses = d3
    .scaleLinear()
    .range([height, 0])
    .domain(d3.extent(militaryExpenses, d => Number.parseInt(d.militaryExpenditures, 10)))
    .nice();

  const xNukes = d3
    .scaleBand()
    .domain(nukesPerYear.map(d => d.year))
    .paddingInner(0.1);

  const yNukes = d3
    .scaleLinear()
    .range([height, 0])
    .domain(d3.extent([0, ...Object.values(nukesPerYearCount)]))
    .nice();

  const lineExpenses = d3
    .line()
    .curve(d3.curveBasis)
    .x(d => xExpenses(new Date(d.year, 0, 1)))
    .y(d => yExpenses(d.militaryExpenditures));

  const counterTarget = container
    .append('text')
    .attr('fill', '#000')
    .attr('y', 30)
    .attr('x', 80)
    .text('0 Nukes');

  function draw() {
    adjustBounds(target, container, margin);

    const width = calcRangeWidth(target, margin);

    xExpenses.range([0, width]);
    xNukes.range([0, width]);

    container.selectAll('g').remove();

    container.append('g')
      .attr('transform', `translate(${margin.left + 2}, ${margin.top})`)
      .append('path')
      .datum(militaryExpenses)
      .attr('fill', 'none')
      .attr('stroke', getColor(countryCode))
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', lineExpenses);

    container.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .selectAll('rect')
      .data(listNukesPerYear)
      .enter()
      .append('rect')
      .attr('class', 'military-expenses-rect')
      .attr('x', d => xNukes(d.year))
      .attr('y', d => yNukes(d.amount || 0))
      .attr('width', xNukes.bandwidth())
      .attr('height', d => height - yNukes(d.amount || 0));

    container
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yExpenses).ticks(4, 's'));

    container
      .append('g')
      .attr('transform', `translate(${width + margin.left}, ${margin.top})`)
      .call(d3.axisRight(yNukes).ticks(4, 's').tickFormat(d3.format('d')));

    container
      .append('g')
      .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
      .call(d3.axisBottom(xExpenses).ticks(5))
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('x', height)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Expenses ($)');
  }

  function setNukes(date) {
    counterTarget.text(`${nukesByCountry.filter(d => d.time < date.getTime()).length} Nukes`);
  }

  return Object.freeze({
    draw,
    setNukes,
  });
}
