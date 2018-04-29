import * as d3 from 'd3';

export function now() { return Date.now(); }

export function getDate(timestamp) {
  if (!Number.isNaN(timestamp)) {
    return new Date(Number.parseFloat(timestamp, 10));
  }
  return new Date(timestamp, 10);
}

export function getYear(timestamp) {
  return getDate(timestamp).getFullYear();
}

export function yearToD3Time(year) {
  return d3.timeParse('%Y')(year);
}

export function onResize(element, callback) {
  element.addEventListener('resize', () => {
    window.requestAnimationFrame(callback);
  });
}
