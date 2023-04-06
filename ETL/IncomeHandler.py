"""
Name:       PANAGIOTIS KOLOKOURIS
AM:         4914
Username:   cse94914
"""

from DataHandler import DataHandler

import pandas as pd

class IncomeHandler(DataHandler):
    
    def __init__(self):
        super().__init__()
        self.incomeByCountry = pd.DataFrame()
        self.incomeIndex = pd.DataFrame()
        self.gdpLabourShare = pd.DataFrame()
        self.grossFixedCapitalFormation = pd.DataFrame()
        self.gdpTotal = pd.DataFrame()
        self.gdpPerCapita = pd.DataFrame()
        self.gniPerCapita = pd.DataFrame()
        self.estimatedGniMale = pd.DataFrame()
        self.estimatedGniFemale = pd.DataFrame()
        self.domesticCredits = pd.DataFrame()
        
        self.excludeRows = [
            'Human Development', 'Very high human development',
            'High human development', 'Medium human development',
            'Low human development', 'Developing Countries', 'Regions',
             'Arab States', 'East Asia and the Pacific',
             'Europe and Central Asia', 'Latin America and the Caribbean',
             'South Asia', 'Sub-Saharan Africa', 'Least Developed Countries',
             'Small Island Developing States',
             'Organization for Economic Co-operation and Development',
             'World']
        
        self.incomeDfs = []
    
    def readIncomeFiles(self):
        """
        Reads income spreadsheet, sheet by sheet and stores one dataframe 
        for each sheet.
    
        """
        incomeByCountryFile = "../../Data/income/Income by Country.xlsx"
        incomeByCountry = pd.ExcelFile(incomeByCountryFile)
        
        self.incomeIndex = incomeByCountry.parse("Income Index")
        self.gdpLabourShare = incomeByCountry.parse("Labour share of GDP")
        self.grossFixedCapitalFormation = incomeByCountry.parse(
            "Gross fixed capital formation")
        self.gdpTotal = incomeByCountry.parse("GDP total")
        self.gdpPerCapita = incomeByCountry.parse("GDP per capita")
        self.gniPerCapita = incomeByCountry.parse("GNI per capita")
        self.estimatedGniMale = incomeByCountry.parse("Estimated GNI male")
        self.estimatedGniFemale = incomeByCountry.parse("Estimated GNI female")
        self.domesticCredits = incomeByCountry.parse("Domestic credits")
        
        self.incomeDfs = [
            self.incomeIndex, self.gdpLabourShare, 
            self.grossFixedCapitalFormation, self.gdpTotal, self.gdpPerCapita,
            self.gniPerCapita, self.estimatedGniMale, self.estimatedGniFemale, 
            self.domesticCredits]
        
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
                    
        # Search all income data for unique countries
        for df in self.incomeDfs:
            temp = df["Country"].drop_duplicates()
            temp = temp[~temp.isin(self.excludeRows)]
            for i in range(len(self.countryDict)):
                temp.loc[temp == self.countryDict.loc[i,"Old Name"]] =\
                    self.countryDict.loc[i,"New Name"]
        
            uniqueCountries = pd.concat([uniqueCountries, temp]).drop_duplicates()
            # uniqueCountries = uniqueCountries.rename("Name")
        
        return uniqueCountries