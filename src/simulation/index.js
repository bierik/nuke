import { createTicker } from '@/ticker';
import { defaultResolution } from '@/config';

export function createSimulation(store, callback, { resolution = defaultResolution } = {}) {
  const first = new Date(Number.parseInt(store.getNukeData()[0].time, 10));
  const last = new Date(Number.parseInt(
    store.getNukeData()[store.getNukeData().length - 1].time,
    10,
  ));
  const length = last - first;
  const now = new Date(first);

  const ticker = createTicker(
    (data, nextTick) => {
      const dataInRange = data.filter(d => d.time < now.getTime());
      data.splice(0, dataInRange.length);
      const progress = 1 - ((last - now) / length);
      nextTick(data);
      callback(dataInRange, progress);
      now.setTime(now.getTime() + resolution);
      if (last - now <= 0) {
        ticker.stop();
      }
    },
    { initValue: store.getNukeData() },
  );

  return ticker;
}
