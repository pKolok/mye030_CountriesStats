"""
Name:       PANAGIOTIS KOLOKOURIS
AM:         4914
Username:   cse94914
"""

import pandas as pd

class FileReader:
    
    def readCountriesFile(self):
        """
        Reads countries data file and returns one dataframe

        Returns
        -------
        countries : Dataframe

        """
        countriesFile = "../../Data/countries/countries.csv"
        
        countries = pd.read_csv(countriesFile, encoding='latin-1')
        
        return countries


    def readDemographicsFiles(self):
        """
        Reads demographics data files and returns one dataframe for each file.

        Returns
        -------
        fertility : Dataframe 
        birthDeath : Dataframe 
        area : Dataframe 
        midYearPopulation : Dataframe 
        midYearPopulation5Year : Dataframe 
        midYearPopulationAge : Dataframe 
        mortality : Dataframe 
        """
        
        fertilyFile = "../../Data/international/age_specific_fertility_rates.csv"
        birthDeathFile = "../../Data/international/birth_death_growth_rates.csv"
        areaFile = "../../Data/international/country_names_area.csv"
        midyearPopulationFile = "../../Data/international/midyear_population.csv"
        midyearPopulation5YearFile = "../../Data/international/" +\
            "midyear_population_5yr_age_sex.csv"
        midyearPopulationAgeFile = "../../Data/international/" +\
            "midyear_population_age_sex.csv"
        mortalityFile = "../../Data/international/mortality_life_expectancy.csv"
        
        fertility = pd.read_csv(fertilyFile)
        birthDeath = pd.read_csv(birthDeathFile)
        area = pd.read_csv(areaFile)
        midYearPopulation = pd.read_csv(midyearPopulationFile)
        midYearPopulation5Year = pd.read_csv(midyearPopulation5YearFile)
        midYearPopulationAge = pd.read_csv(midyearPopulationAgeFile)
        mortality = pd.read_csv(mortalityFile)
        
        return fertility, birthDeath, area, midYearPopulation, \
                midYearPopulation5Year, midYearPopulationAge, mortality


    def readIncomeFiles(self):
        """
        Read income spreadsheet, sheet by sheet and return one dataframe 
        for each sheet.
    
        Returns
        -------
        incomeIndex : Dataframe 
        gdpLabourShare : Dataframe 
        grossFixedCapitalFormation : Dataframe 
        gdpTotal : Dataframe 
        gdpPerCapita : Dataframe 
        gniPerCapita : Dataframe 
        estimatedGniMale : Dataframe 
        estimatedGniFemale : Dataframe 
        domesticCredits : Dataframe 
    
        """
        incomeByCountryFile = "../../Data/income/Income by Country.xlsx"
        
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
        
        return incomeIndex, gdpLabourShare, grossFixedCapitalFormation, \
                gdpTotal, gdpPerCapita, gniPerCapita, estimatedGniMale, \
                estimatedGniFemale, domesticCredits