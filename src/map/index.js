import mapbox from 'mapbox-gl';
import mapRange from 'map-range';
import * as d3 from 'd3';


mapbox.accessToken = 'pk.eyJ1IjoiYmllcmlrIiwiYSI6ImNqZno0MWl0bjN0aDIzNHBkdmJteXJnbzIifQ.Zu6EhGsMcYvdXbjO3LJaHA';

const yieldMapper = mapRange(x => x, 0, 100, 1, 6);

function createTranslation(data, projection) {
  const long = Number.parseFloat(data.long, 10);
  const lat = Number.parseFloat(data.lat, 10);
  const [x, y] = projection([long, lat]);
  return `translate(${x}, ${y})`;
}

export default class Map extends mapbox.Map {
  constructor(data) {
    super({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [0, 0],
      zoom: 1,
      interactive: false,
    });
    this.data = data;
    this.root = d3
      .select(this.getCanvasContainer())
      .append('svg')
      .classed('d3-layer', true);
    this.on('resize', this.rerender);
  }

  getProjection() {
    const bbox = document.querySelector('#map').getBoundingClientRect();
    const center = this.getCenter();
    const zoom = this.getZoom();
    const scale = ((512 * 0.5) / Math.PI) * (2 ** zoom);
    return d3.geoMercator()
      .center([center.lng, center.lat])
      .translate([bbox.width / 2, bbox.height / 2])
      .scale(scale);
  }

  rerender() {
    const projection = this.getProjection();
    this.root
      .selectAll('circle.dot')
      .data(this.data)
      .attr('transform', d => createTranslation(d, projection));
  }

  render() {
    const projection = this.getProjection();
    this.root
      .selectAll('circle.dot')
      .data(this.data)
      .enter()
      .append('circle')
      .classed('dot', true)
      .attr('r', d => yieldMapper(d.yield))
      .attr('fill', 'red')
      .attr('transform', d => createTranslation(d, projection));
  }
}
