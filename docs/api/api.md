# API Documentation

## Nuke Dataset

``` javascript
[
  {
    time: 1523361684246, // Timestamp
    country: "USA", // Maps to a enumeration [USA, RUS, GBR, FRA, CHN, IND, PAK, PRK] in iso country codes
    latitude: "20.77000", // Needs to be converted to y-coordinates
    longitude: "55.00000", // Needs to be converted to x-coordinates
    yield: 23, // In kilotons
  }
]
```

## National Material

``` javascript
[
  {
    country: "USA", // Maps to a enumeration [USA, RUS, GBR, FRA, CHN, IND, PAK, PRK] in iso country codes
    year: 2003,
    militaryExpenditures: 265480000, // thousends in USD
    militaryPersonnel: 2269 // thousands
    energyConsumption: 2468629 // thousands of coal-ton equivalents
    population: 240651 // thousends
  }
]
```

## Overall draft

![](draft2.jpg)

## Detailed Slider draft

![](draft1.jpg)
