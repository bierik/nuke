import '~/normalize.css/normalize.css';
import '~/flexboxgrid-sass/flexboxgrid.scss';
import 'assets/layout.scss';
import '~/mapbox-gl/dist/mapbox-gl.css';
import { renderPoints, createMap } from '@/map';
import { loadNukeData } from '@/api';
import { tick } from '@/utils';


(async () => {
  const data = await loadNukeData();
  const [map, layer] = createMap('map');

  let i = 0;
  const ticker = tick(() => {
    renderPoints(map, layer, [data[i]]);
    i += 1;
  }, 100);
  ticker.start();
})();
