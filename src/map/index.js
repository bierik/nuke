export function sortByTime(data) {
  return data.sort((a, b) =>
    new Date(Number.parseInt(a.time, 10)) -
    new Date(Number.parseInt(b.time, 10)));
}

export * from '@/map/map';
export * from '@/map/countries';
