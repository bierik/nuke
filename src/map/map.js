import mapbox from 'mapbox-gl';
import mapRange from 'map-range';
import * as d3 from 'd3';
import { getColor } from '@/map';
import { mapStyle, mapCenter, mapZoom, mapAccessToken } from '@/config';


mapbox.accessToken = mapAccessToken;

const yieldMapper = mapRange(x => x, 0, 58000, 10, 300);

function createTranslation(data, projection) {
  const longitude = Number.parseFloat(data.longitude, 10);
  const latitude = Number.parseFloat(data.latitude, 10);
  const [x, y] = projection([longitude, latitude]);
  return `translate(${x}, ${y})`;
}

function calcProjection(map) {
  // eslint-disable-next-line no-underscore-dangle
  const bbox = map._container.getBoundingClientRect();
  const center = map.getCenter();
  const zoom = map.getZoom();
  const tileSize = 512;
  const scale = ((tileSize / 2) / Math.PI) * (2 ** zoom);
  return d3.geoMercator()
    .center([center.lng, center.lat])
    .translate([bbox.width / 2, bbox.height / 2])
    .scale(scale);
}

export function renderPoints(map, layer, points) {
  const projection = calcProjection(map);

  layer
    .selectAll('circle.dot')
    .data(points)
    .enter()
    .append('circle')
    .classed('dot', true)
    .attr('fill', d => getColor(d.country))
    .attr('transform', d => createTranslation(d, projection))
    .attr('r', 0)
    .transition()
    .duration(800)
    .style('opacity', 0.4)
    .attr('r', d => Math.sqrt(yieldMapper(d.yield) + Math.PI) * 10)
    .transition()
    .duration(300)
    .style('opacity', 0)
    .remove();
}

function adjustPosition(layer, map) {
  const projection = calcProjection(map);
  layer
    .selectAll('circle.dot')
    .attr('transform', d => createTranslation(d, projection));
}

export function createMap(target) {
  const map = new mapbox.Map({
    container: target,
    style: mapStyle,
    center: mapCenter,
    zoom: mapZoom,
    renderWorldCopies: false,
    interactive: false,
  });

  const layer = d3
    .select(map.getCanvasContainer())
    .append('svg')
    .classed('d3-layer', true);

  map.on('resize', () => adjustPosition(layer, map));

  return [map, layer];
}
