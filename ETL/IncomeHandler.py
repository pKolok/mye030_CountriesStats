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
        
        self.incomeIndexFinal = pd.DataFrame()
        self.gdpLabourShareFinal = pd.DataFrame()
        self.grossFixedCapitalFormationFinal = pd.DataFrame()
        self.gdpTotalFinal = pd.DataFrame()
        self.gdpPerCapitaFinal = pd.DataFrame()
        self.gniPerCapitaFinal = pd.DataFrame()
        self.estimatedGniMaleFinal = pd.DataFrame()
        self.estimatedGniFemaleFinal = pd.DataFrame()
        self.domesticCreditsFinal = pd.DataFrame()
    
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
        
        incomeDfs = [
            self.incomeIndex, self.gdpLabourShare, 
            self.grossFixedCapitalFormation, self.gdpTotal, self.gdpPerCapita,
            self.gniPerCapita, self.estimatedGniMale, self.estimatedGniFemale, 
            self.domesticCredits]
        
        uniqueCountries = pd.Series(dtype = 'object')

        for df in incomeDfs:
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
    
    def restructureData(self):
        """
        Restuctures tables (Unpivot from wide to long format) 
        so that columns of years turn into new rows for each year.

        Returns
        -------
        None.

        """
        
        keys=["country_index", "Country"]
        
        self.incomeIndexFinal = self.incomeIndex.melt(id_vars=keys,
           var_name="Year", value_name="income_index")\
            .sort_values(["country_index", "Year"])
        self.gdpLabourShareFinal = self.gdpLabourShare.melt(id_vars=keys,
            var_name="Year", value_name="labour_share_of_gdp")\
            .sort_values(["country_index", "Year"])
        self.grossFixedCapitalFormationFinal = \
            self.grossFixedCapitalFormation.melt(id_vars=keys,
            var_name="Year", value_name="Gross_fixed_capital_formation")\
            .sort_values(["country_index", "Year"])
        self.gdpTotalFinal = self.gdpTotal.melt(id_vars=keys,
            var_name="Year", value_name="GDP_total")\
            .sort_values(["country_index", "Year"])
        self.gdpPerCapitaFinal = self.gdpPerCapita.melt(id_vars=keys,
            var_name="Year", value_name="GDP_per_capita")\
            .sort_values(["country_index", "Year"])
        self.gniPerCapitaFinal = self.gniPerCapita.melt(id_vars=keys,
            var_name="Year", value_name="GNI_per_capita")\
            .sort_values(["country_index", "Year"]) 
        self.estimatedGniMaleFinal = self.estimatedGniMale.melt(
            id_vars=keys, var_name="Year", value_name="Estimated_GNI_male")\
            .sort_values(["country_index", "Year"]) 
        self.estimatedGniFemaleFinal = self.estimatedGniFemale.melt(
            id_vars=keys, var_name="Year", value_name="Estimated GNI female")\
            .sort_values(["country_index", "Year"])      
        self.domesticCreditsFinal = self.domesticCredits.melt(
            id_vars=keys, var_name="Year", value_name="Domestic credits")\
            .sort_values(["country_index", "Year"])            
        
    def save(self):
        self._setNullForSQL()
        self._renameColumns()
        
        incomeIndexFile = "../../Data/income/income_index_final.csv"
        gdpLabourShareFile = "../../Data/income/labour_share_of_gdp_final.csv"
        grossFixedCapitalFormationFile = "../../Data/income/" \
            "gross_fixed_capital_formation_final.csv"
        gdpTotalFile = "../../Data/income/gdp_total_final.csv"
        gdpPerCapitaFile = "../../Data/income/gdp_per_capita_final.csv"
        gniPerCapitaFile = "../../Data/income/gni_per_capita_final.csv"
        estimatedGniMaleFile = "../../Data/income/estimated_gni_male_final.csv"
        estimatedGniFemaleFile = "../../Data/income/" \
            "estimated_gni_female_final.csv"
        domesticCreditsFile = "../../Data/income/domestic_credits_final.csv"
            
        self.incomeIndexFinal.to_csv(incomeIndexFile, index=False)
        self.gdpLabourShareFinal.to_csv(gdpLabourShareFile, index=False)
        self.grossFixedCapitalFormationFinal.to_csv(
            grossFixedCapitalFormationFile, index=False)
        self.gdpTotalFinal.to_csv(gdpTotalFile, index=False)
        self.gdpPerCapitaFinal.to_csv(gdpPerCapitaFile, index=False)
        self.gniPerCapitaFinal.to_csv(gniPerCapitaFile, index=False)
        self.estimatedGniMaleFinal.to_csv(estimatedGniMaleFile, index=False)
        self.estimatedGniFemaleFinal.to_csv(estimatedGniFemaleFile,
                                            index=False)
        self.domesticCreditsFinal.to_csv(domesticCreditsFile, index=False)
        
        
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
        
        incomeDfs = [
            self.incomeIndex, self.gdpLabourShare, 
            self.grossFixedCapitalFormation, self.gdpTotal, self.gdpPerCapita,
            self.gniPerCapita, self.estimatedGniMale, self.estimatedGniFemale, 
            self.domesticCredits]
        
        # Align countries names with countries.csv[Display_Name]
        for df in incomeDfs:
            super()._alignCountryNames(df, "Country")
        
        # Remove rows with summary stats
        for df in incomeDfs:
            df.drop(index=df[df.Country.isin(self.excludeRows) == True].index\
                    .tolist(), inplace=True)
    
        # Remove uncessary colums in certain tables
        self.gdpTotal.drop(['Info'], axis=1, inplace=True)
        self.gdpPerCapita.drop(['Info'], axis=1, inplace=True)
        self.gniPerCapita.drop(['Info'], axis=1, inplace=True)
        self.estimatedGniMale.drop(['Info'], axis=1, inplace=True)
        self.estimatedGniFemale.drop(['Info'], axis=1, inplace=True)
        
        # Remove non numerical elements
        for df in incomeDfs:
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
                self.gdpLabourShare.insert(index, newYear, pd.NA)
        
        # Similar tables
        dfs = [self.grossFixedCapitalFormation, self.gdpTotal,
               self.gdpPerCapita, self.domesticCredits]
        for df in dfs:
            for year in [1990, 1995, 2000, 2005]:
                index = df.columns.get_loc(year)
                for newYear in range(year + 1, year + 5):
                    index += 1
                    df.insert(index, newYear, pd.NA)
        
        # Similar tables
        dfs = [self.estimatedGniMale, self.estimatedGniFemale]
        for df in dfs:
            for year in [1995, 2000, 2005]:
                index = df.columns.get_loc(year)
                for newYear in range(year + 1, year + 5):
                    index += 1
                    df.insert(index, newYear, pd.NA)
    
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
    
    def _setNullForSQL(self):
        self.incomeIndexFinal.fillna("\\N", inplace=True)
        self.gdpLabourShareFinal.fillna("\\N", inplace=True)
        self.grossFixedCapitalFormationFinal.fillna("\\N", inplace=True)
        self.gdpTotalFinal.fillna("\\N", inplace=True)
        self.gdpPerCapitaFinal.fillna("\\N", inplace=True)
        self.gniPerCapitaFinal.fillna("\\N", inplace=True)
        self.estimatedGniMaleFinal.fillna("\\N", inplace=True)
        self.estimatedGniFemaleFinal.fillna("\\N", inplace=True)
        self.domesticCreditsFinal.fillna("\\N", inplace=True)
    
    def _renameColumns(self):
        commonColDict = {"Country": "country", "Year": "year"}
        grossFixedCapitaLFormColDict = {"Country": "country", "Year": "year",
                               "Gross_fixed_capital_formation":\
                                   "gross_fixed_capital_formation"}
        gdpTotalColDict = {"Country": "country", "Year": "year",
                               "GDP_total": "gdp_total"}
        gdpPerCapitaColDict = {"Country": "country", "Year": "year",
                               "GDP_per_capita": "gdp_per_capita"}
        gniPerCapitaColDict = {"Country": "country", "Year": "year",
                               "GNI_per_capita": "gni_per_capita"}
        gniMaleColDict = {"Country": "country", "Year": "year",
                          "Estimated_GNI_male": "estimated_gni_male"}
        gniFemaleColDict = {"Country": "country", "Year": "year",
                          "Estimated GNI female": "estimated_gni_female"}
        domesticCreditsColDict = {"Country": "country", "Year": "year",
                          "Domestic credits": "domestic_credits"}
        
        self.incomeIndexFinal.rename(columns=commonColDict, inplace=True)
        self.gdpLabourShareFinal.rename(columns=commonColDict,
                                        inplace=True)
        self.grossFixedCapitalFormationFinal.rename(
            columns=grossFixedCapitaLFormColDict, inplace=True)
        self.gdpTotalFinal.rename(columns=gdpTotalColDict, inplace=True)
        self.gdpPerCapitaFinal.rename(columns=gdpPerCapitaColDict,
                                      inplace=True)
        self.gniPerCapitaFinal.rename(columns=gniPerCapitaColDict,
                                      inplace=True)
        self.estimatedGniMaleFinal.rename(columns=gniMaleColDict, inplace=True)
        self.estimatedGniFemaleFinal.rename(columns=gniFemaleColDict,
                                            inplace=True)
        self.domesticCreditsFinal.rename(columns=domesticCreditsColDict,
                                         inplace=True)
        