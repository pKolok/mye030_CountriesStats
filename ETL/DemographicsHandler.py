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
        Also aligns country names with ones in countries.csv based on an
        name correspondence list.
        """
        
        fertilyFile = "../../Data/international/"\
            "age_specific_fertility_rates.csv"
        birthDeathFile = "../../Data/international/"\
            "birth_death_growth_rates.csv"
        areaFile = "../../Data/international/country_names_area.csv"
        midyearPopulationFile = "../../Data/international/"\
            "midyear_population.csv"
        midyearPopulation5YearFile = "../../Data/international/"\
            "midyear_population_5yr_age_sex.csv"
        midyearPopulationAgeFile = "../../Data/international/"\
            "midyear_population_age_sex.csv"
        mortalityFile = "../../Data/international/"\
            "mortality_life_expectancy.csv"
        
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

        # Align countries names with countries.csv[Display_Name]
        for df in self.demographicsDfs:
            super()._alignCountryNames(df, "country_name")
    
    def getUniqueCountries(self):
        """
        Searches all demographics data and puts unique countries in a Series. 
        
        Returns
        -------
        uniqueCountries : Dataframe
            ["country_index", "country_name"]
        """ 
        uniqueCountries = pd.Series(dtype = 'object')
        
        for df in self.demographicsDfs:
            temp = df["country_name"].drop_duplicates()
            uniqueCountries = pd.concat([uniqueCountries,
                                         temp]).drop_duplicates()
            
        return uniqueCountries
            
    def setupPrimaryKeys(self, uniqueCountries):
        """
        Adds primary key column to all demographics tables.

        Parameters
        ----------
        uniqueCountries : Dataframe
            Dataframe of ["country_index", "country_name"]

        Returns
        -------
        None.

        """
        self.fertility = self._addPrimaryKey(
            uniqueCountries, self.fertility)
        self.birthDeath = self._addPrimaryKey(
            uniqueCountries, self.birthDeath)
        self.area = self._addPrimaryKey(
            uniqueCountries, self.area)
        self.midYearPopulation = self._addPrimaryKey(
            uniqueCountries, self.midYearPopulation)
        self.midYearPopulation5Year = self._addPrimaryKey(
            uniqueCountries, self.midYearPopulation5Year)
        self.midYearPopulationAge = self._addPrimaryKey(
            uniqueCountries, self.midYearPopulationAge)
        self.mortality = self._addPrimaryKey(
            uniqueCountries, self.mortality)
            
    def save(self):        
        fertilyFile = "../../Data/international/"\
            "age_specific_fertility_rates_final.csv"
        birthDeathFile = "../../Data/international/"\
            "birth_death_growth_rates_final.csv"
        areaFile = "../../Data/international/country_names_area_final.csv"
        midyearPopulationFile = "../../Data/international/"\
            "midyear_population_final.csv"
        midyearPopulation5YearFile = "../../Data/international/"\
            "midyear_population_5yr_age_sex_final.csv"
        midyearPopulationAgeFile = "../../Data/international/"\
            "midyear_population_age_sex_final.csv"
        mortalityFile = "../../Data/international/"\
            "mortality_life_expectancy_final.csv"
            
        self.fertility.to_csv(fertilyFile, index=False)
        self.birthDeath.to_csv(birthDeathFile, index=False)
        self.area.to_csv(areaFile, index=False)
        self.midYearPopulation.to_csv(midyearPopulationFile, index=False)
        self.midYearPopulation5Year.to_csv(midyearPopulation5YearFile,
                                           index=False)
        self.midYearPopulationAge.to_csv(midyearPopulationAgeFile, index=False)
        self.mortality.to_csv(mortalityFile, index=False)  
        
    def _addPrimaryKey(self, uniqueCountries, df):
        df = df.merge(uniqueCountries, how="inner", left_on="country_name",
                          right_on="country_name")
        df.insert(0, "country_index", df.pop("country_index"))
        return df
