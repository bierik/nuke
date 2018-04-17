export function sortOnTime(data) {
  return data.sort((a, b) => new Date(a.time) - new Date(b.time));
}

export * from '@/map/map';
