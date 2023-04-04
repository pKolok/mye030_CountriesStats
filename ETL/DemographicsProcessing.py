"""
Name:       PANAGIOTIS KOLOKOURIS
AM:         4914
Username:   cse94914
"""

import pandas as pd

# Files
countriesFile = "../../Data/countries.csv"
fertilyFile = "../../Data/age_specific_fertility_rates.csv"
birthDeathFile = "../../Data/birth_death_growth_rates.csv"
areaFile = "../../Data/country_names_area.csv"
midyearPopulationFile = "../../Data/midyear_population.csv"
midyearPopulation5YearFile = "../../Data/midyear_population_5yr_age_sex.csv"
midyearPopulationAgeFile = "../../Data/midyear_population_age_sex.csv"
mortalityFile = "../../Data/mortality_life_expectancy.csv"
incomeByCountryFile = "../../Data/Income by Country.xlsx"

# Read demographics files
countries = pd.read_csv(countriesFile, encoding='latin-1')
fertility = pd.read_csv(fertilyFile)
birthDeath = pd.read_csv(birthDeathFile)
area = pd.read_csv(areaFile)
midYearPopulation = pd.read_csv(midyearPopulationFile)
midYearPopulation5Year = pd.read_csv(midyearPopulation5YearFile)
midYearPopulationAge = pd.read_csv(midyearPopulationAgeFile)
mortality = pd.read_csv(mortalityFile)

# Read income spreadsheet
incomeByCountry = pd.ExcelFile(incomeByCountryFile)
incomeIndex = incomeByCountry.parse("Income Index")
gdpLabourShare = incomeByCountry.parse("Labour share of GDP")
grossFixedCapitalFormation = incomeByCountry.parse(
    "Gross fixed capital formation")
gdpTotal = incomeByCountry.parse("GDP total")
gdpPerCapita = incomeByCountry.parse("GDP per capita")
gniPerCapita = incomeByCountry.parse("GNI per capita")
estimatedGniMale = incomeByCountry.parse("Estimated GNI male")
estimatedGniFemale = incomeByCountry.parse("Estimated GNI female")
domesticCredits = incomeByCountry.parse("Domestic credits")

demographicsDfs = [fertility, birthDeath, area, midYearPopulation, 
                   midYearPopulation5Year, midYearPopulationAge, mortality]
incomeDfs = [incomeIndex, gdpLabourShare, grossFixedCapitalFormation, 
             gdpTotal, gdpPerCapita, gniPerCapita, estimatedGniMale, 
             estimatedGniFemale, domesticCredits]

# Clean up variables
del countriesFile, fertilyFile, birthDeathFile, areaFile, midyearPopulationFile
del midyearPopulation5YearFile, midyearPopulationAgeFile, mortalityFile
del incomeByCountryFile, incomeByCountry

countryDict = pd.DataFrame([
    ["Bahamas The", "Bahamas"],
    ["Burma", "Myanmar"],
    ["Congo (Kinshasa)", "Democratic Republic of the Congo"],
    ["Congo (Brazzaville)", "Republic of the Congo"],
    ["Cote d'Ivoire", "Ivory Coast"],
    ["Gambia The", "Gambia"],
    ["Korea North", "North Korea"],
    ["Korea South", "South Korea"],
    ["Macau", "Macao"],
    ["Micronesia Federated States of", "Micronesia"],
    ["Timor-Leste", "Timor Leste"],
    ["Virgin Islands British", "British Virgin Islands"],
    ["Virgin Islands U.S.", "U.S. Virgin Islands"],
    ["Cabo Verde", "Cape Verde"],
    ["Bolivia (Plurinational State of)", "Bolivia"],
    ["Brunei Darussalam", "Brunei"],
    ["Congo (Democratic Republic of the)", "Democratic Republic of the Congo"],
    ["Congo", "Republic of the Congo"],
    ["CÃ´te d'Ivoire", "Ivory Coast"],
    ["Eswatini (Kingdom of)", "Swaziland"],
    ["Hong Kong; China (SAR)", "Hong Kong"],
    ["Iran (Islamic Republic of)", "Iran"],
    ["Korea (Republic of)", "South Korea"],
    ["Lao People's Democratic Republic", "Laos"],
    ["Micronesia (Federated States of)", "Micronesia"],
    ["Moldova (Republic of)", "Moldova"],
    ["North Macedonia", "Macedonia"],
    ["Palestine; State of", "Palestinian Territory"],
    ["Russian Federation", "Russia"],
    ["Syrian Arab Republic", "Syria"],
    ["Tanzania (United Republic of)", "Tanzania"],
    ["Venezuela (Bolivarian Republic of)", "Venezuela"],
    ["Viet Nam", "Vietnam"]
    ],
    columns = ["Old Name", "New Name"])

excludeRows = ['Human Development', 'Very high human development',
               'High human development', 'Medium human development',
               'Low human development', 'Developing Countries', 'Regions',
               'Arab States', 'East Asia and the Pacific',
               'Europe and Central Asia', 'Latin America and the Caribbean',
               'South Asia', 'Sub-Saharan Africa', 'Least Developed Countries',
               'Small Island Developing States',
               'Organization for Economic Co-operation and Development',
               'World']

# countries.csv   
uniqueCountries = countries['Display_Name'].drop_duplicates()

# Search all demographics data for unique countries
for df in demographicsDfs:
    temp = df["country_name"].drop_duplicates()
    for i in range(len(countryDict)):
        temp.loc[temp == countryDict.loc[i,"Old Name"]] =\
            countryDict.loc[i,"New Name"]

    uniqueCountries = pd.concat([uniqueCountries, temp]).drop_duplicates()
    uniqueCountries = uniqueCountries.rename("Name")
    
# Search all income data for unique countries
for df in incomeDfs:
    temp = df["Country"].drop_duplicates()
    temp = temp[~temp.isin(excludeRows)]
    for i in range(len(countryDict)):
        temp.loc[temp == countryDict.loc[i,"Old Name"]] =\
            countryDict.loc[i,"New Name"]

    uniqueCountries = pd.concat([uniqueCountries, temp]).drop_duplicates()
    uniqueCountries = uniqueCountries.rename("Name")

del i, temp, df

uniqueCountries = uniqueCountries.sort_values()
uniqueCountries = uniqueCountries.reset_index()["Name"]
uniqueCountries = uniqueCountries.reset_index()
uniqueCountries.columns = ["country_index", "country_name"]

# Make demographics
def alignDemographicsCountryNames(df):
    for i in range(len(countryDict)):
        df.loc[df.country_name == countryDict.loc[i,"Old Name"],
               "country_name"] = countryDict.loc[i,"New Name"]
        
for df in demographicsDfs:
    alignDemographicsCountryNames(df)
    
del df

# Add country index into dataframes
def addPrimaryKey(df, joinName, joinMode='inner'):
    df = df.merge(uniqueCountries, how=joinMode, left_on=joinName,
                      right_on="country_name")
    df.insert(0, "country_index", df.pop("country_index"))
    return df

fertility = addPrimaryKey(fertility, "country_name")
birthDeath = addPrimaryKey(birthDeath, "country_name")
area = addPrimaryKey(area, "country_name")
midYearPopulation  = addPrimaryKey(midYearPopulation, "country_name")
midYearPopulation5Year = addPrimaryKey(midYearPopulation5Year, "country_name")
midYearPopulationAge = addPrimaryKey(midYearPopulationAge, "country_name")
mortality = addPrimaryKey(mortality, "country_name")

# Add country index into countries table
countries = addPrimaryKey(countries, "Display_Name", "outer")
countries.loc[countries['Display_Name'].isnull(), 'Display_Name'] =\
    countries.loc[countries['Display_Name'].isnull(), 'country_name']
countries.loc[countries['Official_Name'].isnull(), 'Official_Name'] =\
    countries.loc[countries['Official_Name'].isnull(), 'country_name']
countries.drop(['country_name'], axis=1, inplace=True)

