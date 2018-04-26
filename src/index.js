import '~/normalize.css/normalize.css';
import '~/flexboxgrid-sass/flexboxgrid.scss';
import 'assets/layout.scss';
import '~/mapbox-gl/dist/mapbox-gl.css';
import { renderPoints, createMap} from '@/map';
import renderHistogram from '@/histogram';
import renderMilitaryExpenditures from '@/line-chart';
import { createSimulation } from '@/simulation';
import { createTimeline } from '@/timeline';
import { createProgress } from '@/progress';
import { onResize } from '@/utils';
import { play } from '@/api/audio';
import throttle from 'lodash.throttle';
import { Store } from '@/api/store';

(async () => {
  // Initialize store
  const store = await Store();

  // const playBoom = throttle(() => play(store.getBackgroundMusic()), 1);
  
  const margin = {
    top: 0, right: 20, bottom: 0, left: 20,
  };

  // Initialize progressbar
  const progressbar = createProgress(document.querySelector('#timeline-progress'), margin);

  // Initialize map and d3 layer
  const [map, layer] = createMap('map');

  // Initialize simulation
  const simulation = createSimulation(store.getNukeData(), (points, progress) => {
    // if (points.length > 0) {
    //   playBoom();
    // }
    renderPoints(map, layer, points);
    progressbar.set(progress);
  });

  // Initialize histogram
  renderHistogram(store);
  renderMilitaryExpenditures(store);

  // Initialize timeline
  const timeline = createTimeline(store.getNukeData(), document.querySelector('#timeline-axis'), margin);
  timeline.draw();
  onResize(window, timeline.draw);

  // Start simulation when map is loaded
  map.on('load', () => {
    play(background);
    simulation.start();
  });
})();
