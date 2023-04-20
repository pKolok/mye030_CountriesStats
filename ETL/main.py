"""
Name:       PANAGIOTIS KOLOKOURIS
AM:         4914
Username:   cse94914
"""

from CountriesHandler import CountriesHandler
from DemographicsHandler import DemographicsHandler
from IncomeHandler import IncomeHandler

import pandas as pd

if __name__ == "__main__":
    
    # Instantiate handler classes for 3 different data types
    countriesHandler = CountriesHandler()
    demographicsHandler = DemographicsHandler()
    incomeHandler = IncomeHandler()
    
    # Read countries, demographics and income files
    countriesHandler.readCountriesFile()
    demographicsHandler.readDemographicsFiles()
    incomeHandler.readIncomeFiles()
    
    # Get unique countries from all 3 data sets
    uniqueCountries = countriesHandler.getUniqueCountries()
    uniqueCountries = pd.concat([uniqueCountries, 
                                 demographicsHandler.getUniqueCountries(),
                                 incomeHandler.getUniqueCountries()
                                 ]).drop_duplicates()
    uniqueCountries = uniqueCountries.sort_values().reset_index().iloc[:,1]
    uniqueCountries = uniqueCountries.reset_index()
    uniqueCountries.columns = ["country_index", "country_name"]
    
    # Assign primary keys to all tables of data
    countriesHandler.setupPrimaryKeys(uniqueCountries)
    demographicsHandler.setupPrimaryKeys(uniqueCountries)
    incomeHandler.setupPrimaryKeys(uniqueCountries)
    
    
    incomeHandler.interpolateMissingYears();
    
    # Years from columns to rows
    #incomeHandler.restructureData()
    

