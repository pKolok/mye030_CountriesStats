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
        
    def save(self):
        self._renameColumns()
        
        countriesFile = "../../Data/countries/countriesFinal.csv"
        self.countries.to_csv(countriesFile, index=False)
        
    def _addPrimaryKey(self, uniqueCountries):
        self.countries = self.countries.merge(uniqueCountries, how="outer",
                                              left_on="Display_Name",
                                              right_on="country_name")
        self.countries.insert(0, "country_index",
                              self.countries.pop("country_index"))
        
    def _renameColumns(self):
        columnDictionary = {"ISO": "iso", "ISO3": "iso3",
                            "ISO_Code": "iso_code", "FIPS": "fips",
                            "Display_Name": "display_name",
                            "Official_Name": "official_name",
                            "Capital": "capital", "Continent": "continent",
                            "CurrencyCode": "currency_code",
                            "CurrencyName": "currency_name", "Phone": "phone",
                            "Region Code": "region_code",
                            "Region Name": "region_name",
                            "Sub-region Code": "sub-region_code",
                            "Sub-region Name": "sub-region_name",
                            "Intermediate Region Code": \
                                "intermediate_region_code",
                            "Intermediate Region Name": \
                                "intermediate_region_name",                                
                            "Status": "status",
                            "Developed or Developing": \
                                "developed_or_developing",
                            "Small Island Developing States (SIDS)":\
                                "small_island_developing_states_sids",
                            "Land Locked Developing Countries (LLDC)":\
                                "land_locked_developing_countries_lldc",
                            "Least Developed Countries (LDC)": \
                                "least_developed_countries_ldc",
                            "Area_SqKm": "area_sqkm",
                            "Population": "population"}
        self.countries.rename(columns=columnDictionary, inplace=True)
        
        
        
        