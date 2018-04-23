import { createTicker } from '@/ticker';


export function createSimulation(initialData, callback, { resolution = 10 } = {}) {
  const first = new Date(Number.parseInt(initialData[0].time, 10));
  const now = new Date(first);

  const ticker = createTicker((data, nextTick) => {
    const dataInRange = data.filter(d => d.time < now.getTime());
    data.splice(0, dataInRange.length);
    nextTick(data);
    callback(dataInRange);
    now.setDate(now.getDate() + resolution);
  }, { interval: 100, initValue: initialData });

  return ticker;
}

