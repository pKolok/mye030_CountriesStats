"""
Name:       PANAGIOTIS KOLOKOURIS
AM:         4914
Username:   cse94914
"""

from DataHandler import DataHandler

import pandas as pd

class CountriesHandler(DataHandler):
    
    def __init__(self):
        super().__init__()
        self.countries = pd.DataFrame()
    
    def readCountriesFile(self):
        """
        Reads countries data file and strores one dataframe

        Returns
        -------
        None.

        """
        
        countriesFile = "../../Data/countries/countries.csv"
        
        self.countries = pd.read_csv(countriesFile, encoding='latin-1')
    
    def getUniqueCountries(self):
        """
        Returns unique country names from countries table.

        Returns
        -------
        Series
            Pandas Series of unique country names.

        """
        return self.countries['Display_Name'].drop_duplicates()
    
    def addPrimaryKey(self, uniqueCountries):
        """
        Adds primary key column to countries table.

        Parameters
        ----------
        uniqueCountries : Dataframe
            Dataframe of ["country_index", "country_name"]

        Returns
        -------
        None.

        """
        self.countries = super()._addPrimaryKey(uniqueCountries,
            self.countries, "Display_Name", "outer")
        self.countries.loc[self.countries['Display_Name'].isnull(),
           'Display_Name'] = self.countries.loc[
               self.countries['Display_Name'].isnull(), 'country_name']
        self.countries.loc[self.countries['Official_Name'].isnull(),
           'Official_Name'] = self.countries.loc[self.countries[
               'Official_Name'].isnull(), 'country_name']
        self.countries.drop(['country_name'], axis=1, inplace=True)