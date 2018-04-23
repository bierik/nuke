const colorMap = {
  USA: 'blue',
  RUS: 'red',
  GBR: 'brown',
  FRA: 'white',
  CHN: 'yellow',
  IND: 'green',
  PAK: 'orange',
  PRK: 'violett',
};

export function getColor(country) { return colorMap[country]; }
