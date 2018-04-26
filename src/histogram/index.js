import * as d3 from 'd3';
import { getColor } from '@/map';
import { yearToD3Time } from '@/utils';

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

  function renderNukesPerYear() {
    const svg = d3.select('#nukes-per-year')
      .attr('width', '100%')
      .attr('height', svgHeight);

    svg.selectAll('*').remove();

    const svgWidth = svg.node().getBoundingClientRect().width;
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const x = d3.scaleTime()
      .domain(d3.extent(nukesPerYear, d => d.year))
      .range([0, width])
      .nice();

    const y = d3.scaleLinear()
      .domain([0, d3.max(nukesPerYear, d => d.total)])
      .range([height, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // stacked bars
    g.append('g')
      .selectAll('g')
      .data(d3.stack().keys(countries)(nukesPerYear))
      .enter()
      .append('g')
      .attr('fill', d => getColor(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('opacity', (d) => {
        // thanks to (stupid) linter: (d => d.data.year > currentYear ? 0.3 : 1) not allowed
        let opacity = 1;
        if (d.data.year > currentYear) {
          opacity = 0.3;
        }
        return opacity;
      })
      .attr('x', d => x(d.data.year))
      .attr('y', d => y(d[1]) || 0)
      .attr('height', d => y(d[0]) - y(d[1]) || 0)
      .attr('width', (width / nukesPerYear.length) * 0.7);

    // x-axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)) // use .tick(value) to control the ticks..
      .select('.domain') // remove the lines...
      .remove();

    // y-axis
    g.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(y).ticks(null, 's'));

    // legend
    const legend = g.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .selectAll('g')
      .data(countries.slice().reverse())
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0,${20 * i})`);

    legend.append('rect')
      .attr('x', width - 19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', getColor);

    legend.append('text')
      .attr('x', width - 24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => d);
  }

  function renderMilitaryExpenditures() {
    const svg = d3.select('#military-expenditures')
      .attr('width', '100%')
      .attr('height', svgHeight);

    svg.selectAll('*').remove();

    const svgWidth = svg.node().getBoundingClientRect().width;
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(militaryExpenses, d => d.year))
      .range([0, width])
      .nice();

    const y = d3.scaleLinear()
      .domain([0, d3.max(militaryExpenses, d => d.militaryExpenditures)])
      .range([height, 0]);

    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.militaryExpenditures));

    const drawLine = (data) => {
      // line data values
      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 1.5)
        .attr('d', line); // define d3 line function and use it here..
    };

    // x-axis
    // let xAxis = d3.axisBottom(x).ticks(15);
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)) // use .tick(value) to control the ticks..
      .select('.domain') // remove the lines...
      .remove();

    // y-axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5, 's')) // controls the number of ticks
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Price ($)');

    militaryExpensesPerCountry.map(d => drawLine(d));
  }

  function render() {
    renderNukesPerYear();
    renderMilitaryExpenditures();
  }

  return { render, setCurrentYear };
}
