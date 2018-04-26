import '~/normalize.css/normalize.css';
import '~/flexboxgrid-sass/flexboxgrid.scss';
import 'assets/layout.scss';
import '~/mapbox-gl/dist/mapbox-gl.css';
import { renderPoints, createMap } from '@/map';
import { Histogram } from '@/histogram';
import { createSimulation } from '@/simulation';
import { createTimeline } from '@/timeline';
import { createProgress } from '@/progress';
import { onResize, getYear } from '@/utils';
import { play } from '@/api/audio';
import throttle from 'lodash.throttle';
import { Store } from '@/api/store';

(async () => {
  // Initialize store
  const store = await Store();

  const playBoom = throttle(() => play(store.getBackgroundMusic()), 1);
 
  const margin = {
    top: 0, right: 50, bottom: 0, left: 50,
  };

  // Initialize map and d3 layer
  const [map, layer] = createMap('map');

  // Initialize progressbar
  const progressbar = createProgress(document.querySelector('#timeline-progress'), margin);

  // Initialize timeline
  const timeline = createTimeline(store.getNukeData(), document.querySelector('#timeline-axis'), margin);
  timeline.draw();

  // Initialize histogram
  const histogram = Histogram(store);
  histogram.render();

  // Initialize simulation
  const simulation = createSimulation(store.getNukeData(), (points, progress) => {
    // if (points.length > 0) {
    //   playBoom();
    // }
    renderPoints(map, layer, points);
    progressbar.set(progress);

    if (points.length) {
      histogram.setCurrentYear(getYear(points[0].time));
    }
    histogram.render();
  });

  // Start simulation when map is loaded
  map.on('load', () => {
    play(store.getBackgroundMusic());
    simulation.start();
  });

  onResize(window, () => {
    timeline.draw();
    histogram.render();
  });
})();

