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

        Returns
        -------
        None.

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
        
        self._cleanUp()
        
    def getUniqueCountries(self):
        """
        Searches all income data and puts unique countries in a Series. 
        
        Returns
        -------
        uniqueCountries : Dataframe
            ["country_index", "country_name"]
        """
        uniqueCountries = pd.Series(dtype = 'object')

        for df in self.incomeDfs:
            temp = df["Country"].drop_duplicates()       
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
        self.incomeIndex = self._addPrimaryKey(
            uniqueCountries, self.incomeIndex)
        self.gdpLabourShare = self._addPrimaryKey(
            uniqueCountries, self.gdpLabourShare)
        self.grossFixedCapitalFormation = self._addPrimaryKey(
            uniqueCountries, self.grossFixedCapitalFormation)
        self.gdpTotal = self._addPrimaryKey(
            uniqueCountries, self.gdpTotal)
        self.gdpPerCapita = self._addPrimaryKey(
            uniqueCountries, self.gdpPerCapita)
        self.gniPerCapita = self._addPrimaryKey(
            uniqueCountries, self.gniPerCapita)
        self.estimatedGniMale = self._addPrimaryKey(
            uniqueCountries, self.estimatedGniMale)
        self.estimatedGniFemale = self._addPrimaryKey(
            uniqueCountries, self.estimatedGniFemale)
        self.domesticCredits = self._addPrimaryKey(
            uniqueCountries, self.domesticCredits)
        
        # self.incomeDfs = [
        #     self.incomeIndex, self.gdpLabourShare, 
        #     self.grossFixedCapitalFormation, self.gdpTotal, self.gdpPerCapita,
        #     self.gniPerCapita, self.estimatedGniMale, self.estimatedGniFemale, 
        #     self.domesticCredits]
        
        # for df in self.incomeDfs:
        #     df.drop(["country_name"], axis=1, inplace=True)
        
    def _cleanUp(self):
        """
        Undertake initial data cleaning/tidying up in terms of:
            - Aligns country names with ones in countries.csv based on an
            name correspondence list
            - Remove rows with summary stats
            - Remove unnecessary columns if any
        Returns
        -------
        None.

        """
        self.incomeDfs = [
            self.incomeIndex, self.gdpLabourShare, 
            self.grossFixedCapitalFormation, self.gdpTotal, self.gdpPerCapita,
            self.gniPerCapita, self.estimatedGniMale, self.estimatedGniFemale, 
            self.domesticCredits]
        
        # Align countries names with countries.csv[Display_Name]
        for df in self.incomeDfs:
            super()._alignCountryNames(df, "Country")
        
        # Remove rows with summary stats
        for df in self.incomeDfs:
            df.drop(index=df[df.Country.isin(self.excludeRows) == True].index\
                    .tolist(), inplace=True)
    
        # Remove uncessary colums in certain tables
        self.gdpTotal.drop(['Info'], axis=1, inplace=True)
        self.gdpPerCapita.drop(['Info'], axis=1, inplace=True)
        self.gniPerCapita.drop(['Info'], axis=1, inplace=True)
        self.estimatedGniMale.drop(['Info'], axis=1, inplace=True)
        self.estimatedGniFemale.drop(['Info'], axis=1, inplace=True)
        
    def _addPrimaryKey(self, uniqueCountries, df):
        df = df.merge(uniqueCountries, how="inner", left_on="Country",
                          right_on="country_name")
        df.insert(0, "country_index", df.pop("country_index"))
        df.drop(["country_name"], axis=1, inplace=True)
        return df
    
    
    
    
    
    
    