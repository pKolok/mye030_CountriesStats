const fertility = [
    "Fertility Rate",
    "Gross Reproduction Rate",
    "Sex Ratio at Birth"
];

const birthDeathGrowth = [
    "Crude Birth Rate",
    "Crude Death Rate",
    "Net Migration Rate",
    "Rate of Natural Increase",
    "Growth Rate"
];

const area = [
    "Country Area"
];

const midYearPopulation = [
    "Mid-Year Population (by Age Group)",
    "Mid-Year Population (by Age)"
];

const mortality = [
    "Infant Mortality Rate",
    "Life Expectancy at Birth",
    "Under-5 Mortality Rate",
    "Child Mortality Rate"
];

const incomeStats = [
    "Income index",
    "Domestic Credit Provided by Financial Sector",
    "Estimated Gross National Income per Capita",
    "GDP per Capita",
    "Gross Domestic Product (GDP) (total)",
    "Gross Fixed Capital Formation",
    "Gross National Income (GNI) per Capita",
    "Labour Share of GDP"
]

export const Statistics: string[] = [
    ...fertility,
    ...birthDeathGrowth,
    ...midYearPopulation,
    ...mortality,
    ...incomeStats
];