-- To run sql scripts from cmd:
-- source C:/Users/panou/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/mye030_CountriesStats/ETL/Load3IncomeToDB.sql;
-- source C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/mye030_CountriesStats/ETL/Load3IncomeToDB.sql;

use mye030_countries_stats;

-- Load domestic credits:
select "----- Create table domestic_credits -----";
drop table if exists domestic_credits; show warnings;
create table domestic_credits (
	country_index int not null,
	country_name varchar(255),
	year int not null,
	domestic_credits float,
	primary key (country_index, year),
	foreign key (country_index) references countries(country_index)
	on delete cascade
);
show warnings;
describe domestic_credits;

-- load data local infile 'C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/domestic_credits_final.csv'
load data local infile 'C:/Users/panou/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/domestic_credits_final.csv'
into table domestic_credits
fields terminated by ','
lines terminated by '\r\n'
IGNORE 1 LINES;

show warnings;
select * from domestic_credits limit 10;


-- Load estimate gni female:
select "----- Create table estimated_gni_female -----";
drop table if exists estimated_gni_female; show warnings;
create table estimated_gni_female (
	country_index int not null,
	country_name varchar(255),
	year int not null,
	estimated_gni_female float,
	primary key (country_index, year),
	foreign key (country_index) references countries(country_index)
	on delete cascade
);
show warnings;
describe estimated_gni_female;

-- load data local infile 'C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/estimated_gni_female_final.csv'
load data local infile 'C:/Users/panou/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/estimated_gni_female_final.csv'
into table estimated_gni_female
fields terminated by ','
lines terminated by '\r\n'
IGNORE 1 LINES;

show warnings;
select * from estimated_gni_female limit 10;


-- Load estimate gni male:
select "----- Create table estimated_gni_male -----";
drop table if exists estimated_gni_male; show warnings;
create table estimated_gni_male (
	country_index int not null,
	country_name varchar(255),
	year int not null,
	estimated_gni_male float,
	primary key (country_index, year),
	foreign key (country_index) references countries(country_index)
	on delete cascade
);
show warnings;
describe estimated_gni_male;

-- load data local infile 'C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/estimated_gni_male_final.csv'
load data local infile 'C:/Users/panou/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/estimated_gni_male_final.csv'
into table estimated_gni_male
fields terminated by ','
lines terminated by '\r\n'
IGNORE 1 LINES;

show warnings;
select * from estimated_gni_male limit 10;


-- Load gdp per capita:
select "----- Create table gdp_per_capita -----";
drop table if exists gdp_per_capita; show warnings;
create table gdp_per_capita (
	country_index int not null,
	country_name varchar(255),
	year int not null,
	gdp_per_capita float,
	primary key (country_index, year),
	foreign key (country_index) references countries(country_index)
	on delete cascade
);
show warnings;
describe gdp_per_capita;

-- load data local infile 'C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/gdp_per_capita_final.csv'
load data local infile 'C:/Users/panou/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/gdp_per_capita_final.csv'
into table gdp_per_capita
fields terminated by ','
lines terminated by '\r\n'
IGNORE 1 LINES;

show warnings;
select * from gdp_per_capita limit 10;


-- Load total gdp:
select "----- Create table gdp_total -----";
drop table if exists gdp_total; show warnings;
create table gdp_total (
	country_index int not null,
	country_name varchar(255),
	year int not null,
	gdp_total float,
	primary key (country_index, year),
	foreign key (country_index) references countries(country_index)
	on delete cascade
);
show warnings;
describe gdp_total;

-- load data local infile 'C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/gdp_total_final.csv'
load data local infile 'C:/Users/panou/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/gdp_total_final.csv'
into table gdp_total
fields terminated by ','
lines terminated by '\r\n'
IGNORE 1 LINES;

show warnings;
select * from gdp_total limit 10;


-- Load gni per capita:
select "----- Create table gni_per_capita -----";
drop table if exists gni_per_capita; show warnings;
create table gni_per_capita (
	country_index int not null,
	country_name varchar(255),
	year int not null,
	gni_per_capita int,
	primary key (country_index, year),
	foreign key (country_index) references countries(country_index)
	on delete cascade
);
show warnings;
describe gni_per_capita;

-- load data local infile 'C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/gni_per_capita_final.csv'
load data local infile 'C:/Users/panou/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/gni_per_capita_final.csv'
into table gni_per_capita
fields terminated by ','
lines terminated by '\r\n'
IGNORE 1 LINES;

show warnings;
select * from gni_per_capita limit 10;


-- Load gross fixed capital formation:
select "----- Create table gross_fixed_capital_formation -----";
drop table if exists gross_fixed_capital_formation; show warnings;
create table gross_fixed_capital_formation (
	country_index int not null,
	country_name varchar(255),
	year int not null,
	gross_fixed_capital_formation float,
	primary key (country_index, year),
	foreign key (country_index) references countries(country_index)
	on delete cascade
);
show warnings;
describe gross_fixed_capital_formation;

-- load data local infile 'C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/gross_fixed_capital_formation_final.csv'
load data local infile 'C:/Users/panou/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/gross_fixed_capital_formation_final.csv'
into table gross_fixed_capital_formation
fields terminated by ','
lines terminated by '\r\n'
IGNORE 1 LINES;

show warnings;
select * from gross_fixed_capital_formation limit 10;


-- Load income index:
select "----- Create table income_index -----";
drop table if exists income_index; show warnings;
create table income_index (
	country_index int not null,
	country_name varchar(255),
	year int not null,
	income_index float,
	primary key (country_index, year),
	foreign key (country_index) references countries(country_index)
	on delete cascade
);
show warnings;
describe income_index;

-- load data local infile 'C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/income_index_final.csv'
load data local infile 'C:/Users/panou/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/income_index_final.csv'
into table income_index
fields terminated by ','
lines terminated by '\r\n'
IGNORE 1 LINES;

show warnings;
select * from income_index limit 10;


-- Load labour share of gdp:
select "----- Create table labour_share_of_gdp -----";
drop table if exists labour_share_of_gdp; show warnings;
create table labour_share_of_gdp (
	country_index int not null,
	country_name varchar(255),
	year int not null,
	labour_share_of_gdp float,
	primary key (country_index, year),
	foreign key (country_index) references countries(country_index)
	on delete cascade
);
show warnings;
describe labour_share_of_gdp;

-- load data local infile 'C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/labour_share_of_gdp_final.csv'
load data local infile 'C:/Users/panou/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/income/labour_share_of_gdp_final.csv'
into table labour_share_of_gdp
fields terminated by ','
lines terminated by '\r\n'
IGNORE 1 LINES;

show warnings;
select * from labour_share_of_gdp limit 10;