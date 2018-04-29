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
import { Store } from '@/api/store';

(async () => {
  // Initialize store
  const store = await Store();

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
    renderPoints(map, layer, points);
    progressbar.set(progress);

    if (points.length) {
      histogram.setCurrentYear(getYear(points[0].time));
    }
    histogram.render();
  });

  function start() {
    play(store.getBackgroundMusic());
    simulation.start();
    document.querySelector('body').classList.add('running');
  }

  map.on('load', () => {
    document.querySelector('body').classList.remove('loading');
    document.querySelector('.start-nuke').addEventListener('click', start);
  });

  onResize(window, () => {
    timeline.draw();
    histogram.render();
  });
})();

