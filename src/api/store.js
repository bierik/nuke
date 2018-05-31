import { sortByTime, colorMap } from '@/map';
import { loadNukeData, loadMilitaryData } from '@/api';
import groupBy from 'lodash.groupby';
import mapValues from 'lodash.mapvalues';


export async function Store() {
  const nukeData = await loadNukeData();
  const militaryData = await loadMilitaryData();

  function getNukesPerYear() {
    const defaultCountryValues = Object.keys(colorMap)
      .reduce((acc, c) => Object.assign(acc, { [c]: 0 }), {});

    const nukesPerYear = groupBy(
      nukeData,
      d => new Date(Number.parseInt(d.time, 10)).getFullYear(),
    );

    for (let i = 1945; i <= 2010; i += 1) {
      if (!(nukesPerYear[i])) {
        nukesPerYear[i] = [];
      }
    }

    const nukesPerYearPerCountry = mapValues(
      nukesPerYear,
      d => mapValues(groupBy(d, 'country'), e => e.length),
    );

    const nukesPerYearPerCountrySum = Object.keys(nukesPerYearPerCountry).map((d) => {
      const row = nukesPerYearPerCountry[d];
      const total = Object.keys(row).reduce((acc, r) => row[r] + acc, 0);
      return Object.assign(nukesPerYearPerCountry[d], { year: d, total });
    });

    // d3 js stack function expects keyed values. So every country needs to have a value
    return nukesPerYearPerCountrySum
      .map(e => Object.assign(Object.assign({}, defaultCountryValues), e));
  }

  function getMilitaryData(countryCode) {
    return militaryData.filter(d => d.country === countryCode);
  }

  function nukesByCountry(countryCode) {
    return sortByTime(nukeData.filter(d => d.country === countryCode));
  }

  return {
    getNukeData: () => sortByTime(nukeData),
    getMilitaryData,
    getNukesPerYear,
    nukesByCountry,
  };
}
