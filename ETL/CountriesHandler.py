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
    
    def setupPrimaryKeys(self, uniqueCountries):
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
        self._addPrimaryKey(uniqueCountries)
        
        self.countries.loc[self.countries['Display_Name'].isnull(),
           'Display_Name'] = self.countries.loc[
               self.countries['Display_Name'].isnull(), 'country_name']
        self.countries.loc[self.countries['Official_Name'].isnull(),
           'Official_Name'] = self.countries.loc[self.countries[
               'Official_Name'].isnull(), 'country_name']
        self.countries.drop(['country_name'], axis=1, inplace=True)
        
    def _addPrimaryKey(self, uniqueCountries):
        self.countries = self.countries.merge(uniqueCountries, how="outer",
                                              left_on="Display_Name",
                                              right_on="country_name")
        self.countries.insert(0, "country_index",
                              self.countries.pop("country_index"))
        
        
        
        
        
        
        