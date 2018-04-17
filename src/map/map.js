import mapbox from 'mapbox-gl';
import mapRange from 'map-range';
import * as d3 from 'd3';


mapbox.accessToken = 'pk.eyJ1IjoiYmllcmlrIiwiYSI6ImNqZno0MWl0bjN0aDIzNHBkdmJteXJnbzIifQ.Zu6EhGsMcYvdXbjO3LJaHA';

const yieldMapper = mapRange(x => x, 0, 85000, 10, 20);

function createTranslation(data, projection) {
  const longitude = Number.parseFloat(data.longitude, 10);
  const latitude = Number.parseFloat(data.latitude, 10);
  const [x, y] = projection([longitude, latitude]);
  return `translate(${x}, ${y})`;
}

function calcProjection(map) {
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
    .transition()
    .duration(50)
    .attr('r', 0)
    .remove();

  layer
    .selectAll('circle.dot')
    .data(points)
    .enter()
    .append('circle')
    .classed('dot', true)
    .attr('fill', 'red')
    .attr('transform', d => createTranslation(d, projection))
    .attr('r', 0)
    .transition()
    .duration(100)
    .attr('r', d => yieldMapper(d.yield));
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
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [0, 0],
    zoom: 1,
    interactive: false,
  });

  const layer = d3
    .select(map.getCanvasContainer())
    .append('svg')
    .classed('d3-layer', true);

  map.on('resize', () => adjustPosition(layer, map));

  return [map, layer];
}
