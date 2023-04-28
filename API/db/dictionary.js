// Dictionary mapping from database name to a more formal name
dbToFormal = new Map();
dbToFormal.set("midyear_population",  "Mid-Year Population");
dbToFormal.set("gdp_total",  "Gross domestic product (GDP), total " + 
    "[2011 PPP $billions]"); 

// Dictionary mapping from a formal name to a database name
formalToDb = new Map();
formalToDb.set("Mid-Year Population", "midyear_population");
formalToDb.set("Total GDP", "gdp_total");

exports.FormalName = (name) => dbToFormal.get(name);
exports.dataBaseName = (name) => formalToDb.get(name);