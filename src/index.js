import '~/normalize.css/normalize.css';
import '~/flexboxgrid-sass/flexboxgrid.scss';
import 'assets/layout.scss';
import '~/mapbox-gl/dist/mapbox-gl.css';
import { renderPoints, createMap, sortByTime } from '@/map';
import { loadNukeData, loadMilitaryData } from '@/api';
import renderHistogram from '@/histogram';
import renderMilitaryExpenditures from '@/line-chart';
import { createSimulation } from '@/simulation';
import { createTimeline } from '@/timeline';
import { createProgress } from '@/progress';
import { onResize } from '@/utils';
import { load, play } from '@/audio';
import throttle from 'lodash.throttle';

const PLAYBACK_FILE = 'assets/background.mp3';
const BOOM_FILE = 'assets/boom.mp3';


(async () => {
  // Load Data
  const nukeData = sortByTime(await loadNukeData());
  const militaryData = await loadMilitaryData();
  // const audio = await loadPlayback();
  const boom = await load(BOOM_FILE);
  const background = await load(PLAYBACK_FILE);
  const playBoom = throttle(() => play(boom), 1);

  const margin = {
    top: 0, right: 20, bottom: 0, left: 20,
  };

  // Initialize progressbar
  const progressbar = createProgress(document.querySelector('#timeline-progress'), margin);

  // Initialize map and d3 layer
  const [map, layer] = createMap('map');

  renderHistogram(nukeData);
  renderMilitaryExpenditures(militaryData);
  // Initialize simulation
  const simulation = createSimulation(nukeData, (points, progress) => {
    // if (points.length > 0) {
    //   playBoom();
    // }
    renderPoints(map, layer, points);
    progressbar.set(progress);
  });

  // Initialize histogram
  renderHistogram(nukeData);

  // Initialize timeline
  const timeline = createTimeline(nukeData, document.querySelector('#timeline-axis'), margin);
  timeline.draw();
  onResize(window, timeline.draw);

  // Start simulation when map is loaded
  map.on('load', () => {
    play(background);
    simulation.start();
  });
})();
