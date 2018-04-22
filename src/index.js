import '~/normalize.css/normalize.css';
import '~/flexboxgrid-sass/flexboxgrid.scss';
import 'assets/layout.scss';
import '~/mapbox-gl/dist/mapbox-gl.css';
import { renderPoints, createMap, sortByTime } from '@/map';
import { loadNukeData } from '@/api';
import renderHistogram from '@/histogram';
import { createSimulation } from '@/simulation';


(async () => {
  const data = sortByTime(await loadNukeData());
  const [map, layer] = createMap('map');
  renderHistogram(data);
  const simulation = createSimulation(data, (points) => {
    renderPoints(map, layer, points);
  });
  map.on('load', simulation.start);
})();
