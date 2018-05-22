export const colorMap = {
  USA: '#cb4f42',
  RUS: '#45b2c4',
  GBR: '#b85abe',
  FRA: '#57a95b',
  CHN: '#7278cb',
  IND: '#999a3e',
  PAK: '#c55d86',
  PRK: '#c98443',
};

export function getColor(country) { return colorMap[country]; }
