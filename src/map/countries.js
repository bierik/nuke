export const colorMap = {
  USA: 'rgb(55, 126, 184)',
  RUS: 'rgb(228, 26, 28)',
  GBR: 'rgb(77, 175, 74)',
  FRA: 'rgb(152, 78, 163)',
  CHN: 'rgb(255, 127, 0)',
  IND: 'rgb(166, 86, 40)',
  PAK: 'rgb(106, 61, 154)',
  PRK: 'rgb(0, 0, 0)',
};

export function getColor(country) { return colorMap[country]; }
