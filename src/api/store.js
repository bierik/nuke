import { sortByTime } from '@/map';
import { loadNukeData, loadMilitaryData, loadBoomSound, loadBackgroundMusic } from '@/api';
import { yearToD3Time, getYear } from '@/utils';

export async function Store() {
  const nukeData = await loadNukeData();
  const militaryData = await loadMilitaryData();
  const boomSound = await loadBoomSound();
  const backgroundMusic = await loadBackgroundMusic();

  // get distinct countries: [USA, RUS, ...]
  function getCountries() {
    return nukeData.map(d => d.country)
      .reduce((a, c) => (a.includes(c) ? a : [...a, c]), []); // distinct
  }

  // [ {year: 1945, USA: 5, RUS: 2, total: 7}, {year: 1945, USA: 2, total: 2}, ...]
  function getNukesPerYear() {
    return Object.values(nukeData.reduce((acc, current) => {
      const year = yearToD3Time(getYear(current.time));

      acc[year] = acc[year] || { year };
      acc[year][current.country] = (acc[year][current.country] || 0) + 1;
      acc[year].total = (acc[year].total || 0) + 1;

      return acc;
    }, {}));
  }

  // get military expenses per country and year: [ {year: 1945, country: USA, expenses: 580 },  ...]
  function getMilitaryExpenses() {
    return militaryData.reduce((acc, current) => {
      const data = {};

      data.country = current.country;
      data.year = yearToD3Time(current.year);
      data.militaryExpenditures = Number.parseInt(current.militaryExpenditures, 10);

      acc.push(data);

      return acc;
    }, []);
  }

  /*
  Get military expenses in seperate array per country
  [
   [{year: 1945, country: USA, expenses: 580 }, {year: 1945, country: USA, expenses: 580 }, ...],
   [{year: 1945, country: RUS, expenses: 180 }, ...], ...
  ]
  */
  function getMilitaryExpensesPerCountry() {
    return Object.values(getMilitaryExpenses().reduce((acc, current) => {
      acc[current.country] = acc[current.country] || [];
      acc[current.country].push(current);
      return acc;
    }, {}));
  }

  return {
    getNukeData: () => sortByTime(nukeData),
    getMilitaryData: () => militaryData,
    getBoomSound: () => boomSound,
    getBackgroundMusic: () => backgroundMusic,
    getCountries,
    getNukesPerYear,
    getMilitaryExpenses,
    getMilitaryExpensesPerCountry,
  };
}
