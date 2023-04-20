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
        
        self.incomeCombined = pd.DataFrame()
        
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
    
    def interpolateMissingYears(self):
        """
        For those tables which are missing years, interpolate between the 
        existing years. E.g. if 2000 and 2005 exist, interpolate to get values
        for years 2001, 2002, 2003, 2004.

        Returns
        -------
        None.

        """
        
        self._addMissingYearColumns();
        self._fillInInterpolationColumns()
    
    # TODO
    def restructureData(self):
        """
        Restuctures tables so that columns of years turn into new rows for
        each year.

        Returns
        -------
        None.

        """
        
        keys=["country_index", "Country"]
        incomeIndex = self.incomeIndex.melt(id_vars=keys,
           var_name="Year", value_name="income_index")\
            .sort_values(["country_index", "Year"])
        gdpLabourShare = self.gdpLabourShare.melt(id_vars=keys,
            var_name="Year", value_name="labour_share_of_gdp")\
            .sort_values(["country_index", "Year"])
        
        # maybe not a good idea...
        self.incomeCombined = incomeIndex.merge(gdpLabourShare, how="outer",
            left_on=["country_index", "Country", "Year"], 
            right_on=["country_index", "Country", "Year"], sort=True)
    
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
        
        # Remove non numerical elements
        for df in self.incomeDfs:
            df.replace("..", pd.NA, inplace=True)
        
    def _addPrimaryKey(self, uniqueCountries, df):
        df = df.merge(uniqueCountries, how="inner", left_on="Country",
                          right_on="country_name")
        df.insert(0, "country_index", df.pop("country_index"))
        df.drop(["country_name"], axis=1, inplace=True)
        return df
    
    def _addMissingYearColumns(self):
        
        # Labour share of GDP
        for year in [2000, 2005]:
            index = self.gdpLabourShare.columns.get_loc(year)
            for newYear in range(year + 1, year + 5):
                index += 1
                self.gdpLabourShare.insert(index, newYear, "")
        
        # Similar tables
        dfs = [self.grossFixedCapitalFormation, self.gdpTotal,
               self.gdpPerCapita, self.domesticCredits]
        for df in dfs:
            for year in [1990, 1995, 2000, 2005]:
                index = df.columns.get_loc(year)
                for newYear in range(year + 1, year + 5):
                    index += 1
                    df.insert(index, newYear, "")
        
        # Similar tables
        dfs = [self.estimatedGniMale, self.estimatedGniFemale]
        for df in dfs:
            for year in [1995, 2000, 2005]:
                index = df.columns.get_loc(year)
                for newYear in range(year + 1, year + 5):
                    index += 1
                    df.insert(index, newYear, "")
    
    def _fillInInterpolationColumns(self):
        
        # Labour share of GDP
        for years in [(2000,2005), (2005,2010)]:
            validLoc = self.gdpLabourShare[years[0]].notnull() &\
                        self.gdpLabourShare[years[1]].notnull()
            i = 1
            for newYear in range(years[0] + 1, years[0] + 5):
                diff = (self.gdpLabourShare[years[1]] -
                 self.gdpLabourShare[years[0]]) / 5
                self.gdpLabourShare.loc[validLoc, newYear] =\
                    self.gdpLabourShare[years[0]] + i * diff
                i += 1
    
        # Similar tables
        dfs = [self.grossFixedCapitalFormation, self.gdpTotal,
               self.gdpPerCapita, self.domesticCredits]
        for df in dfs:
            for years in [(1990,1995), (1995,2000), (2000,2005), (2005,2010)]:
                validLoc = df[years[0]].notnull() & df[years[1]].notnull()
                i = 1
                for newYear in range(years[0] + 1, years[0] + 5):
                    diff = (df[years[1]] - df[years[0]]) / 5
                    df.loc[validLoc, newYear] = df[years[0]] + i * diff
                    i += 1
    
        # Similar tables
        dfs = [self.estimatedGniMale, self.estimatedGniFemale]
        for df in dfs:
            for years in [(1995,2000), (2000,2005), (2005,2010)]:
                validLoc = df[years[0]].notnull() & df[years[1]].notnull()
                i = 1
                for newYear in range(years[0] + 1, years[0] + 5):
                    diff = (df[years[1]] - df[years[0]]) / 5
                    df.loc[validLoc, newYear] = df[years[0]] + i * diff
                    i += 1            
    
    