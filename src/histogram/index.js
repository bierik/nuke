import * as d3 from 'd3';

const svgWidth = 1600;
const svgHeight = 500;

const svg = d3.select('#histogram')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

const margin = {
  top: 20, right: 20, bottom: 30, left: 100,
};
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;
const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

const x = d3.scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.05)
  .align(0.1);

const y = d3.scaleLinear()
  .rangeRound([height, 0]);

const z = d3.scaleOrdinal()
  .range(['#2D7DD2', '#97CC04', '#FFD400', '#F45D01',
    '#F7BC47', '#F23C18', '#35BFCC', '#0C1519']);

export default function renderHistogram(data) {
  const countries = data.map(d => d.country)
    .reduce((a, c) => (a.includes(c) ? a : [...a, c]), []); // distinct

  const histogramData = Object.values(data.reduce((acc, current) => {
    const year = new Date(Number.parseInt(current.time, 10)).getFullYear();

    acc[year] = acc[year] || { year };
    acc[year][current.country] = (acc[year][current.country] || 0) + 1;
    acc[year].total = (acc[year].total || 0) + 1;

    return acc;
  }, {}));

  x.domain(histogramData.map(d => d.year));
  y.domain([0, d3.max(histogramData, d => d.total)]).nice();
  z.domain(countries);

  // stacked bars
  g.append('g')
    .selectAll('g')
    .data(d3.stack().keys(countries)(histogramData))
    .enter()
    .append('g')
    .attr('fill', d => z(d.key))
    .selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
    .attr('x', d => x(d.data.year))
    .attr('y', d => y(d[1]) || 0)
    .attr('height', d => y(d[0]) - y(d[1]) || 0)
    .attr('width', x.bandwidth());

  // x-axis
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .select('.domain')
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
    .attr('fill', z);

  legend.append('text')
    .attr('x', width - 24)
    .attr('y', 9.5)
    .attr('dy', '0.32em')
    .text(d => d);
}
