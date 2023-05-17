dbToFormal_fertility = [
    ["fertility_rate_15_19", "Fertility Rate between ages 15-19 [Births per 1,000 population]"],
    ["fertility_rate_20_24", "Fertility Rate between ages 20-24 [Births per 1,000 population]"],
    ["fertility_rate_25_29", "Fertility Rate between ages 25-29 [Births per 1,000 population]"],
    ["fertility_rate_30_34", "Fertility Rate between ages 30-34 [Births per 1,000 population]"],
    ["fertility_rate_35_39", "Fertility Rate between ages 35-39 [Births per 1,000 population]"],
    ["fertility_rate_40_44", "Fertility Rate between ages 40-44 [Births per 1,000 population]"],
    ["fertility_rate_45_49", "Fertility Rate between ages 45-49 [Births per 1,000 population]"],
    ["total_fertility_rate", "Total Fertility Rate [Lifetime births per woman]"],
    ["gross_reproduction_rate", "Gross Reproduction Rate [Lifetime female births per woman]"],
    ["sex_ratio_at_birth", "Sex Ratio at Birth [Male births per female birth]"]
];

formalToDb_fertility = [
    ["Fertility Rate", "fertility_rate"],
    ["Gross Reproduction Rate", "gross_reproduction_rate"],
    ["Sex Ratio at Birth", "sex_ratio_at_birth"]
];

statToTable_fertility = [
    ["fertility_rate_15_19", "fertility_rates"],
    ["fertility_rate_20_24", "fertility_rates"],
    ["fertility_rate_25_29", "fertility_rates"],
    ["fertility_rate_30_34", "fertility_rates"],
    ["fertility_rate_35_39", "fertility_rates"],
    ["fertility_rate_40_44", "fertility_rates"],
    ["fertility_rate_45_49", "fertility_rates"],
    ["total_fertility_rate", "fertility_rates"],
    ["gross_reproduction_rate", "fertility_rates"],
    ["sex_ratio_at_birth", "fertility_rates"]
];

dbToFormal_birthDeathGrowth = [
    ["crude_birth_rate", "Crude birth rate [Births per 1,000 population]"],
    ["crude_death_rate", "Crude death rate [Deaths per 1,000 population]"],
    ["net_migration", "Net migration rate [Net number of migrants per 1,000 population]"],
    ["rate_natural_increase", "Rate of natural increase [%]"],
    ["growth_rate", "Growth rate [%]"]
];

formalToDb_birthDeathGrowth = [
    ["Crude Birth Rate", "crude_birth_rate"],
    ["Crude Death Rate", "crude_death_rate"],
    ["Net Migration Rate", "net_migration"],
    ["Rate of Natural Increase", "rate_natural_increase"],
    ["Growth Rate", "growth_rate"]
];

statToTable_birthDeathGrowth = [
    ["crude_birth_rate", "birth_death_rates"],
    ["crude_death_rate", "birth_death_rates"],
    ["net_migration", "birth_death_rates"],
    ["rate_natural_increase", "birth_death_rates"],
    ["growth_rate", "birth_death_rates"]
];

dbToFormal_area = [
    ["country_area", "Country Area [Square km]"]
];

formalToDb_area = [
    ["Country Area", "country_area"]
];

statToTable_area = [
    ["country_area", "country_areas"]
];

dbToFormal_midYearPopulation = [
    ["midyear_population", "Mid-Year Population [Both Sexes Population]"],
    ["midyear_population_male", "Mid-Year Population [Male Population]"],
    ["midyear_population_female", "Mid-Year Population [Female Population]"],
    ["population_age", "Mid-Year Population at Age [Population]"],
    
];

formalToDb_midYearPopulation = [
    ["Mid-Year Population (by Age Group)", "midyear_population"],
    ["Mid-Year Population (by Age)", "population_age"],  
];

statToTable_midYearPopulation = [
    ["midyear_population", "midyear_population_5yr"],
    ["midyear_population_male", "midyear_population_5yr"],
    ["midyear_population_female", "midyear_population_5yr"],
    ["population_age", "midyear_population_1yr"],
];

dbToFormal_mortality= [
    ["infant_mortality", "Infant Mortality Rate (Both Sexes) [Infant deaths per 1,000 population]"],
    ["infant_mortality_male", "Infant Mortality Rate (Male) [Infant deaths per 1,000 population]"],
    ["infant_mortality_female", "Infant Mortality Rate (Female) [Infant deaths per 1,000 population]"],
    ["life_expectancy", "Life Expectancy at Birth (Both Sexes) [Years]"],
    ["life_expectancy_male", "Life Expectancy at Birth (Male) [Years]"],
    ["life_expectancy_female", "Life Expectancy at Birth (Female) [Years]"],
    ["mortality_rate_under5", "Under-5 Mortality Rate (Both Sexes) [Probability of dying between ages 0-5]"],
    ["mortality_rate_under5_male", "Under-5 Mortality Rate (Male) [Probability of dying between ages 0-5]"],
    ["mortality_rate_under5_female", "Under-5 Mortality Rate (Female) [Probability of dying between ages 0-5]"],
    ["mortality_rate_1to4", "Child Mortality Rate (Both Sexes) [Probability of dying between ages 1-4]"],
    ["mortality_rate_1to4_male", "Child Mortality Rate (Male) [Probability of dying between ages 1-4]"],
    ["mortality_rate_1to4_female", "Child Mortality Rate (Female) [Probability of dying between ages 1-4]"],
];

formalToDb_mortality = [
    ["Infant Mortality Rate", "infant_mortality"],
    ["Life Expectancy at Birth", "life_expectancy"],
    ["Under-5 Mortality Rate", "mortality_rate_under5"],
    ["Child Mortality Rate", "mortality_rate_1to4"],
];

statToTable_mortality= [
    ["infant_mortality", "life_expectancy"],
    ["infant_mortality_male", "life_expectancy"],
    ["infant_mortality_female", "life_expectancy"],
    ["life_expectancy", "life_expectancy"],
    ["life_expectancy_male", "life_expectancy"],
    ["life_expectancy_female", "life_expectancy"],
    ["mortality_rate_under5", "life_expectancy"],
    ["mortality_rate_under5_male", "life_expectancy"],
    ["mortality_rate_under5_female", "life_expectancy"],
    ["mortality_rate_1to4", "life_expectancy"],
    ["mortality_rate_1to4_male", "life_expectancy"],
    ["mortality_rate_1to4_female", "life_expectancy"],
];

dbToFormal_income = [
    ["income_index", "Income Index [GNI per capita (2011 PPP $) expressed as Index]"],
    ["domestic_credits", "Domestic Credit Provided by Financial Sector [% of GDP]"],
    ["estimated_gni_female", "Estimated Gross National Income per Capita (Female) [2011 PPP $]"],
    ["estimated_gni_male", "Estimated Gross National Income per Capita (Male) [2011 PPP $]"],
    ["gdp_per_capita", "GDP per Capita [2011 PPP $]"],
    ["gdp_total", "Gross Domestic Product (GDP) (total) [2011 PPP $ billions]"],
    ["gross_fixed_capital_formation", "Gross Fixed Capital Formation [% of GDP]"],
    ["gni_per_capita", "Gross National Income (GNI) per Capita [2011 PPP $]"],
    ["labour_share_of_gdp", "Labour Share of GDP, Comprising Wages and Social Protection Transfers [%]"],
];

formalToDb_income = [
    ["Income index", "income_index"],
    ["Domestic Credit Provided by Financial Sector", "domestic_credits"],
    ["Estimated Gross National Income per Capita", "estimated_gni"],
    ["GDP per Capita", "gdp_per_capita"],
    ["Gross Domestic Product (GDP) (total)", "gdp_total"],
    ["Gross Fixed Capital Formation", "gross_fixed_capital_formation"],
    ["Gross National Income (GNI) per Capita", "gni_per_capita"],
    ["Labour Share of GDP", "labour_share_of_gdp"],
];

statToTable_income = [
    ["income_index", "income_index"],
    ["domestic_credits", "domestic_credits"],
    ["estimated_gni_female", "estimated_gni_female"],
    ["estimated_gni_male", "estimated_gni_male"],
    ["gdp_per_capita", "gdp_per_capita"],
    ["gdp_total", "gdp_total"],
    ["gross_fixed_capital_formation", "gross_fixed_capital_formation"],
    ["gni_per_capita", "gni_per_capita"],
    ["labour_share_of_gdp", "labour_share_of_gdp"],
];

dbToFormal_All = [
    ...dbToFormal_fertility, 
    ...dbToFormal_birthDeathGrowth,
    ...dbToFormal_area,
    ...dbToFormal_midYearPopulation,
    ...dbToFormal_mortality,
    ...dbToFormal_income
];

formalToDb_All = [
    ...formalToDb_fertility,
    ...formalToDb_birthDeathGrowth,
    ...formalToDb_area,
    ...formalToDb_midYearPopulation,
    ...formalToDb_mortality,
    ...formalToDb_income
];

statToTable_All = [
    ...statToTable_fertility,
    ...statToTable_birthDeathGrowth,
    ...statToTable_area,
    ...statToTable_midYearPopulation,
    ...statToTable_mortality,
    ...statToTable_income
];

// Dictionary mapping from database name to a more formal name
dbToFormal = new Map(dbToFormal_All);

// Dictionary mapping from a formal name to a database name
formalToDb = new Map(formalToDb_All);

// Dictionary mapping from a db statistic name to a db table
statToTable = new Map(statToTable_All);

exports.FormalName = (name) => dbToFormal.get(name);
exports.dataBaseName = (name) => formalToDb.get(name);
exports.dataBaseTable = (stat) => statToTable.get(stat);