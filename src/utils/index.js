export function now() { return Date.now(); }

export function tick(callback, interval = 1000, init = false) {
  let running = init;

  function loop(time = now()) {
    requestAnimationFrame(() => {
      if (now() - time > interval) {
        if (running) {
          callback();
        }
        loop();
      } else {
        loop(time);
      }
    });
  }

  loop();

  return Object.freeze({
    start: () => { running = true; },
    stop: () => { running = false; },
  });
}
