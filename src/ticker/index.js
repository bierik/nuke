import { now } from '@/utils';
import { defaultInterval } from '@/config';


export function createTicker(callback, { init = false, initValue = null, interval = defaultInterval } = {}) {
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

