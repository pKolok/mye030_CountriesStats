"""
Name:       PANAGIOTIS KOLOKOURIS
AM:         4914
Username:   cse94914
"""

import pandas as pd

class DataHandler:
    
    def __init__(self):
        self.countryDict = pd.DataFrame([
            ["Bahamas The", "Bahamas"],
            ["Burma", "Myanmar"],
            ["Congo (Kinshasa)", "Democratic Republic of the Congo"],
            ["Congo (Brazzaville)", "Republic of the Congo"],
            ["Cote d'Ivoire", "Ivory Coast"],
            ["Gambia The", "Gambia"],
            ["Korea North", "North Korea"],
            ["Korea South", "South Korea"],
            ["Macau", "Macao"],
            ["Micronesia Federated States of", "Micronesia"],
            ["Timor-Leste", "Timor Leste"],
            ["Virgin Islands British", "British Virgin Islands"],
            ["Virgin Islands U.S.", "U.S. Virgin Islands"],
            ["Cabo Verde", "Cape Verde"],
            ["Bolivia (Plurinational State of)", "Bolivia"],
            ["Brunei Darussalam", "Brunei"],
            ["Congo (Democratic Republic of the)", "Democratic Republic of the Congo"],
            ["Congo", "Republic of the Congo"],
            ["CÃ´te d'Ivoire", "Ivory Coast"],
            ["Eswatini (Kingdom of)", "Swaziland"],
            ["Hong Kong; China (SAR)", "Hong Kong"],
            ["Iran (Islamic Republic of)", "Iran"],
            ["Korea (Republic of)", "South Korea"],
            ["Lao People's Democratic Republic", "Laos"],
            ["Micronesia (Federated States of)", "Micronesia"],
            ["Moldova (Republic of)", "Moldova"],
            ["North Macedonia", "Macedonia"],
            ["Palestine; State of", "Palestinian Territory"],
            ["Russian Federation", "Russia"],
            ["Syrian Arab Republic", "Syria"],
            ["Tanzania (United Republic of)", "Tanzania"],
            ["Venezuela (Bolivarian Republic of)", "Venezuela"],
            ["Viet Nam", "Vietnam"]
            ],
            columns = ["Old Name", "New Name"])
        
    
    def _addPrimaryKey(self, uniqueCountries, df, joinName, joinMode='inner'):
        df = df.merge(uniqueCountries, how=joinMode, left_on=joinName,
                          right_on="country_name")
        df.insert(0, "country_index", df.pop("country_index"))
        return df