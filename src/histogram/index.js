import * as d3 from 'd3';
import { getColor } from '@/map';
import { yearToD3Time } from '@/utils';
import { createLegend } from '@/histogram/legend';
import { createXAxis, createYAxis } from '@/histogram/axis';

const svgHeight = 500;
const margin = {
  top: 10, right: 50, bottom: 30, left: 50,
};

export function Histogram(store) {
  const countries = store.getCountries();
  const nukesPerYear = store.getNukesPerYear();
  const militaryExpenses = store.getMilitaryExpenses();
  const militaryExpensesPerCountry = store.getMilitaryExpensesPerCountry();

  let currentYear = nukesPerYear[0].year; // in d3 time
  function setCurrentYear(year) {
    currentYear = yearToD3Time(year);
  }

  function initSVG(svgId) {
    const svg = d3.select(svgId)
      .attr('width', '100%')
      .attr('height', svgHeight);

    svg.selectAll('*').remove();

    const svgWidth = svg.node().getBoundingClientRect().width;
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    return { g, width, height };
  }

  function renderNukesPerYear() {
    const svg = initSVG('#nukes-per-year');

    const x = d3.scaleTime()
      .domain(d3.extent(nukesPerYear, d => d.year))
      .range([0, svg.width])
      .nice();

    const y = d3.scaleLinear()
      .domain([0, d3.max(nukesPerYear, d => d.total)])
      .range([svg.height, 0]);

    // stacked bars
    svg.g.append('g')
      .selectAll('g')
      .data(d3.stack().keys(countries)(nukesPerYear))
      .enter()
      .append('g')
      .attr('fill', d => getColor(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .style('opacity', (d) => {
        // linter doesn't like: (d => d.data.year > currentYear ? 0.3 : 1)
        let opacity = 1;
        if (d.data.year > currentYear) {
          opacity = 0.3;
        }
        return opacity;
      })
      .attr('x', d => x(d.data.year))
      .attr('y', d => y(d[1]) || 0)
      .attr('height', d => y(d[0]) - y(d[1]) || 0)
      .attr('width', (svg.width / nukesPerYear.length) * 0.7);

    svg.g.append(() => createXAxis(x, 0, svg.height).node());
    svg.g.append(() => createYAxis(y, 0, 0, 'Amount of Nukes').node());

    svg.g.append(() => createLegend(store, svg.width - 20, 20).node());
  }


  function renderMilitaryExpenditures() {
    const svg = initSVG('#military-expenditures');

    const x = d3.scaleTime()
      .domain(d3.extent(militaryExpenses, d => d.year))
      .range([0, svg.width])
      .nice();

    const y = d3.scaleLinear()
      .domain([0, d3.max(militaryExpenses, d => d.militaryExpenditures)])
      .range([svg.height, 0]);

    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.militaryExpenditures));

    const drawLine = (data, opacity = 1) => {
      // line data values
      svg.g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', getColor(data[0].country))
        .attr('opacity', opacity)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 3)
        .attr('d', line); // define d3 line function and use it here..
    };

    svg.g.append(() => createXAxis(x, 0, svg.height).node());
    svg.g.append(() => createYAxis(y, 0, 0, 'Expenses ($)').node());


    militaryExpensesPerCountry.forEach((country) => {
      let data = country.filter(expense => expense.year >= currentYear);
      if (data.length) {
        drawLine(data, 0.3);
      }
      data = country.filter(expense => expense.year <= currentYear);
      if (data.length) {
        drawLine(data);
      }
    });
  }

  function render() {
    renderNukesPerYear();
    renderMilitaryExpenditures();
  }

  return { render, setCurrentYear };
}
