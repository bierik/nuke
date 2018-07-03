import '~/normalize.css/normalize.css';
import '~/flexboxgrid-sass/flexboxgrid.scss';
import 'assets/layout.scss';
import { renderPoints, createMap, colorMap } from '@/map';
import { createHistogram } from '@/histogram';
import { createSimulation } from '@/simulation';
import { createTimeline } from '@/timeline';
import { createLegend } from '@/legend';
import { craeteMilitaryChart } from '@/military';
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
  const countryCodes = Object.keys(colorMap);


  const histogramMargin = {
    top: 0, right: 20, bottom: 0, left: 30,
  };

  const militaryMargin = {
    top: 20, right: 60, bottom: 0, left: 20,
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
  const timelineProgresses = [];
  timelineProgresses.push(createProgress(document.querySelector('#histogram-progress'), histogramMargin));
  timelineProgresses.push(createProgress(document.querySelector('#military-progress'), militaryMargin));

  // Initialize timeline
  const timeline = createTimeline(store.getNukeData(), document.querySelector('#timeline-axis'), histogramMargin);

  // Initialize histogram
  const histogram = createHistogram(store, document.querySelector('#nukes-per-year'), histogramMargin);

  // Initialize legend
  createLegend(document.querySelector('#country-legend'));

  const militaryTargets = document.querySelectorAll('.military-target');

  const militaryCharts = countryCodes
    .map((c, i) => craeteMilitaryChart(store, c, militaryTargets[i], militaryMargin));

  // Initialize simulation
  const simulation = createSimulation(store, (points, progress, now) => {
    militaryCharts.forEach(m => m.setNukes(now));
    renderPoints(map, layer, points);
    timelineProgresses.forEach(d => d.set(progress));
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
    histogram.draw();
    timeline.draw();
    map.fitBounds([[-180, 0], [180, 70]]);
    militaryCharts.forEach(m => m.draw());
  }

  map.on('load', () => {
    document.querySelector('body').classList.remove('loading');
    document.querySelector('.start-nuke').addEventListener('click', toggle);
    draw();
  });

  onResize(window, draw);
})();

