const colorMap = {
  USA: '#2D7DD2',
  RUS: '#97CC04',
  GBR: '#FFD400',
  FRA: '#F45D01',
  CHN: '#F7BC47',
  IND: '#F23C18',
  PAK: '#35BFCC',
  PRK: '#0C1519',
};

export function getColor(country) { return colorMap[country]; }
