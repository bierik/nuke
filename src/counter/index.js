import { createTicker } from '@/ticker';


export function createCounter(cv, apply) {
  let ticker;
  let currentValue = cv;
  function goTo(n, speed = 1000) {
    const interval = Math.floor(speed / Math.abs(n - currentValue));
    const direction = n < currentValue ? -1 : 1;
    if (ticker && ticker.isRunning) {
      ticker.stop();
    }
    ticker = createTicker((value, nextTick) => {
      currentValue = value;
      apply(value);
      nextTick(value + (1 * direction));
      if (value === n) {
        ticker.stop();
      }
    }, { initValue: currentValue, init: true, interval });
  }
  return Object.freeze({ goTo });
}
