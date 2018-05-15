export const colorMap = {
  USA: '#5C6BC0',
  RUS: '#EF5350',
  GBR: '#AB47BC',
  FRA: '#26A69A',
  CHN: '#9CCC65',
  IND: '#FFCA28',
  PAK: '#78909C',
  PRK: '#8D6E63',
};

export function getColor(country) { return colorMap[country]; }
