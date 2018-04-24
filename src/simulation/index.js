import { createTicker } from '@/ticker';
import { defaultResolution } from '@/config';


export function createSimulation(initialData, callback, { resolution = defaultResolution } = {}) {
  const first = new Date(Number.parseInt(initialData[0].time, 10));
  const last = new Date(Number.parseInt(initialData[initialData.length - 1].time, 10));
  const length = last - first;
  const now = new Date(first);

  const ticker = createTicker((data, nextTick) => {
    const dataInRange = data.filter(d => d.time < now.getTime());
    data.splice(0, dataInRange.length);
    const progress = 1 - ((last - now) / length);
    nextTick(data);
    callback(dataInRange, progress);
    now.setTime(now.getTime() + resolution);
    if (last - now <= 0) {
      ticker.stop();
    }
  }, { initValue: initialData });

  return ticker;
}

