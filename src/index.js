import '~/normalize.css/normalize.css';
import '~/flexboxgrid-sass/flexboxgrid.scss';
import 'assets/layout.scss';
import { renderPoints, createMap } from '@/map';
import { createHistogram } from '@/histogram';
import { craeteMilitaryChart } from '@/military';
import { createSimulation } from '@/simulation';
import { createTimeline } from '@/timeline';
import { createLegend } from '@/legend';
import { createProgress } from '@/progress';
import { onResize } from '@/utils';
import { load, Player } from '@/api/audio';
import { Store } from '@/api/store';


(async () => {
  // Initialize store

  const PLAYBACK_FILE = 'assets/background.mp3';
  const store = await Store();

  const player = new Player();
  const backgroundMusic = await load(PLAYBACK_FILE, player.context);


  const margin = {
    top: 0, right: 50, bottom: 0, left: 50,
  };

  const state = {
    target: document.querySelector('body'),
    activate() {
      this.target.classList.add('running');
      this.target.classList.remove('paused');
    },
    deactivate() {
      this.target.classList.add('paused');
    },
  };

  // Initialize map and d3 layer
  const [map, layer] = createMap('map');

  // Initialize progressbar
  const progressbar = createProgress(document.querySelector('#timeline-progress'), margin);

  // Initialize timeline
  const timeline = createTimeline(store.getNukeData(), document.querySelector('#timeline-axis'), margin);

  // Initialize histogram
  const histogram = createHistogram(store, document.querySelector('#nukes-per-year'), {
    top: 20, right: 50, bottom: 0, left: 50,
  });

  // Initialize legend
  createLegend(document.querySelector('#country-legend'));

  // Initialize military chart
  const military = craeteMilitaryChart(store, document.querySelector('#military-expenses'), {
    top: 0, right: 50, bottom: 0, left: 50,
  });

  // Initialize simulation
  const simulation = createSimulation(store, (points, progress) => {
    renderPoints(map, layer, points);
    progressbar.set(progress);
  });

  function toggle() {
    if (simulation.isRunning()) {
      simulation.stop();
      player.pause();
      state.deactivate();
    } else {
      simulation.start();
      player.play(backgroundMusic);
      state.activate();
    }
  }

  function draw() {
    military.draw();
    histogram.draw();
    timeline.draw();
  }

  map.on('load', () => {
    document.querySelector('body').classList.remove('loading');
    document.querySelector('.start-nuke').addEventListener('click', toggle);
    draw();
  });

  onResize(window, draw);
})();

