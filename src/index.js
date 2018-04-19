import '~/normalize.css/normalize.css';
import '~/flexboxgrid-sass/flexboxgrid.scss';
import 'assets/layout.scss';
import '~/mapbox-gl/dist/mapbox-gl.css';
import { renderPoints, createMap } from '@/map';
import { loadNukeData, loadMilitaryData } from '@/api';
import { tick } from '@/utils';
import renderHistogram from '@/histogram';
import renderMilitaryExpenditures from '@/line-chart';

(async () => {
  const nukeData = await loadNukeData();
  const militaryData = await loadMilitaryData();
  const [map, layer] = createMap('map');

  renderHistogram(nukeData);
  renderMilitaryExpenditures(militaryData);

  let i = 0;
  const ticker = tick(() => {
    renderPoints(map, layer, [nukeData[i]]);
    i += 1;
  }, 100);
  ticker.start();
})();
