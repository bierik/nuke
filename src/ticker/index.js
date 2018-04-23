import { now } from '@/utils';


export function createTicker(callback, { init = false, initValue = null, interval = 1000 } = {}) {
  let running = init;
  let returnValue = initValue;

  function next(time = now()) {
    requestAnimationFrame(() => {
      if (now() - time > interval) {
        if (running) {
          callback(returnValue, (newValue) => { returnValue = newValue; });
        }
        next();
      } else {
        next(time);
      }
    });
  }

  next();

  return Object.freeze({
    start: () => { running = true; },
    stop: () => { running = false; },
  });
}

