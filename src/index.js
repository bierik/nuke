import '~/normalize.css/normalize.css';
import '~/flexboxgrid-sass/flexboxgrid.scss';
import 'assets/layout.scss';
import '~/mapbox-gl/dist/mapbox-gl.css';
import Map from '@/map';
import { loadNukeData } from '@/api';


(async () => {
  const data = await loadNukeData();
  const map = new Map(data);
  map.render();
})();
