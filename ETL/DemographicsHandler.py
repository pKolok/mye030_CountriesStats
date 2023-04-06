"""
Name:       PANAGIOTIS KOLOKOURIS
AM:         4914
Username:   cse94914
"""

from DataHandler import DataHandler

import pandas as pd

class DemographicsHandler(DataHandler):
    
    def __init__(self):
        super().__init__()
        self.fertility = pd.DataFrame()
        self.birthDeath = pd.DataFrame()
        self.area = pd.DataFrame()
        self.midYearPopulation = pd.DataFrame()
        self.midYearPopulation5Year = pd.DataFrame()
        self.midYearPopulationAge = pd.DataFrame()
        self.mortality = pd.DataFrame()
        
        self.demographicsDfs = []
    
    def readDemographicsFiles(self):
        """
        Reads demographics data files and stores one dataframe for each file.
 
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
        
        self.fertility = pd.read_csv(fertilyFile)
        self.birthDeath = pd.read_csv(birthDeathFile)
        self.area = pd.read_csv(areaFile)
        self.midYearPopulation = pd.read_csv(midyearPopulationFile)
        self.midYearPopulation5Year = pd.read_csv(midyearPopulation5YearFile)
        self.midYearPopulationAge = pd.read_csv(midyearPopulationAgeFile)
        self.mortality = pd.read_csv(mortalityFile)        

        self.demographicsDfs = [
              self.fertility,  self.birthDeath,  self.area,  
              self.midYearPopulation,  self.midYearPopulation5Year, 
              self.midYearPopulationAge,  self.mortality]               
    
    def getUniqueCountries(self):
        """
        Searches all data provided and puts unique countries in a list. 
        Then assigns unique index.
        
        Returns
        -------
        uniqueCountries : Dataframe
            ["country_index", "country_name"]
        """
        
        uniqueCountries = pd.Series()
        
        # Search all demographics data for unique countries
        for df in self.demographicsDfs:
            temp = df["country_name"].drop_duplicates()
            for i in range(len(self.countryDict)):
                temp.loc[temp == self.countryDict.loc[i,"Old Name"]] =\
                    self.countryDict.loc[i,"New Name"]
        
            uniqueCountries = pd.concat([uniqueCountries,
                                         temp]).drop_duplicates()
            
        return uniqueCountries
    
    def alignCountryNames(self):
        for df in self.demographicsDfs:
            for i in range(len(self.countryDict)):
                df.loc[df.country_name == self.countryDict.loc[i,"Old Name"],
                       "country_name"] = self.countryDict.loc[i,"New Name"]
            
    def addPrimaryKey(self, uniqueCountries):
        # for df in self.demographicsDfs:
        #     super()._addPrimaryKey(uniqueCountries, df, "country_name")
        self.fertility = super()._addPrimaryKey(
            uniqueCountries, self.fertility, "country_name")
        self.birthDeath = super()._addPrimaryKey(
            uniqueCountries, self.birthDeath,"country_name")
        self.area = super()._addPrimaryKey(
            uniqueCountries, self.area, "country_name")
        self.midYearPopulation  = super()._addPrimaryKey(
            uniqueCountries, self.midYearPopulation, "country_name")
        self.midYearPopulation5Year = super()._addPrimaryKey(
            uniqueCountries, self.midYearPopulation5Year, "country_name")
        self.midYearPopulationAge = super()._addPrimaryKey(
            uniqueCountries, self.midYearPopulationAge, "country_name")
        self.mortality = super()._addPrimaryKey(
            uniqueCountries, self.mortality, "country_name")
            
    # Add country index into dataframes
    # def __addPrimaryKey(uniqueCountries, df, joinName):
    #     df = df.merge(uniqueCountries, how='inner', left_on=joinName,
    #                       right_on="country_name")
    #     df.insert(0, "country_index", df.pop("country_index"))
    #     return df
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
    