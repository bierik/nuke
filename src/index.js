import '~/normalize.css/normalize.css';
import '~/flexboxgrid-sass/flexboxgrid.scss';
import 'assets/layout.scss';
import '~/mapbox-gl/dist/mapbox-gl.css';
import { renderPoints, createMap, sortByTime } from '@/map';
import { loadNukeData, loadMilitaryData } from '@/api';
import renderHistogram from '@/histogram';
import renderMilitaryExpenditures from '@/line-chart';
import { createSimulation } from '@/simulation';

(async () => {
  const nukeData = sortByTime(await loadNukeData());
  const militaryData = await loadMilitaryData();
  const [map, layer] = createMap('map');

  renderHistogram(nukeData);
  renderMilitaryExpenditures(militaryData);
 
  const simulation = createSimulation(nukeData, (points) => {
    renderPoints(map, layer, points);
  });
  map.on('load', simulation.start);
 
})();