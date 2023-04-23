-- To run sql scripts from cmd:
-- source C:/Users/panou/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/mye030_CountriesStats/ETL/Load2InternationalToDB.sql;
-- source C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/mye030_CountriesStats/ETL/Load2InternationalToDB.sql;

use mye030_countries_stats;

-- Load age specific fertility rates:
select "----- Create table fertility_rates -----";
drop table if exists fertility_rates;
create table fertility_rates (
	country_index int not null,
	country_code varchar(5),
	country_name varchar(255),
	year int not null,
	fertility_rate_15_19 float,
	fertility_rate_20_24 float,
	fertility_rate_25_29 float,
	fertility_rate_30_34 float,
	fertility_rate_35_39 float,
	fertility_rate_40_44 float,
	fertility_rate_45_49 float,
	total_fertility_rate float,
	gross_reproduction_rate float,
	sex_ratio_at_birth float,
	primary key (country_index, year),
	foreign key (country_index) references countries(country_index)
	on delete cascade
);
describe fertility_rates;

load data local infile 'C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/international/age_specific_fertility_rates_final.csv'
into table fertility_rates
fields terminated by ','
lines terminated by '\r\n'
IGNORE 1 LINES;

show warnings;
select * from fertility_rates limit 10;


-- Load birth date growth rates:
select "----- Create table birth_death_rates -----";
drop table if exists birth_death_rates;
create table birth_death_rates (
	country_index int not null,
	country_code varchar(5),
	country_name varchar(255),
	year int not null,
	crude_birth_rate float,
	crude_death_rate float,
	net_migration float,
	rate_natural_increase float,
	growth_rate float,
	primary key (country_index, year),
	foreign key (country_index) references countries(country_index)
	on delete cascade
);
describe birth_death_rates;

load data local infile 'C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/international/birth_death_growth_rates_final.csv'
into table birth_death_rates
fields terminated by ','
lines terminated by '\r\n'
IGNORE 1 LINES;

show warnings;
select * from birth_death_rates limit 10;


-- Load country areas:
select "----- Create table country_areas -----";
drop table if exists country_areas;
create table country_areas (
	country_index int not null,
	country_code varchar(5),
	country_name varchar(255),
	country_area int,
	primary key (country_index),
	foreign key (country_index) references countries(country_index)
	on delete cascade
);
describe country_areas;

load data local infile 'C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/international/country_names_area_final.csv'
into table country_areas
fields terminated by ','
lines terminated by '\r\n'
IGNORE 1 LINES;

show warnings;
select * from country_areas limit 10;


-- Load midyear population (/5 years):
select "----- Create table midyear_population_5yr -----";
drop table if exists midyear_population_5yr;
create table midyear_population_5yr (
	country_index int not null,
	country_code varchar(5),
	country_name varchar(255),
	year int not null,
	total_flag varchar(5) not null,
	starting_age smallint not null,
	age_group_indicator varchar(5),
	ending_age smallint,
	midyear_population int,
	midyear_population_male int,
	midyear_population_female int,
	primary key (country_index, year, total_flag, starting_age),
	foreign key (country_index) references countries(country_index)
	on delete cascade
);
describe midyear_population_5yr;

load data local infile 'C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/international/midyear_population_5yr_age_sex_final.csv'
into table midyear_population_5yr
fields terminated by ','
lines terminated by '\r\n'
IGNORE 1 LINES;

show warnings;
select * from midyear_population_5yr limit 10;


-- Load midyear population:
select "----- Create table midyear_population_1yr-----";
drop table if exists midyear_population_1yr;
create table midyear_population_1yr (
	country_index int not null,
	country_code varchar(5),
	country_name varchar(255),
	year int not null,
	sex varchar(10) not null,
	max_age smallint,
	population_age_0 int,
	population_age_1 int,
	population_age_2 int,
	population_age_3 int,
	population_age_4 int,
	population_age_5 int,
	population_age_6 int,
	population_age_7 int,
	population_age_8 int,
	population_age_9 int,
	population_age_10 int,
	population_age_11 int,
	population_age_12 int,
	population_age_13 int,
	population_age_14 int,
	population_age_15 int,
	population_age_16 int,
	population_age_17 int,
	population_age_18 int,
	population_age_19 int,
	population_age_20 int,
	population_age_21 int,
	population_age_22 int,
	population_age_23 int,
	population_age_24 int,
	population_age_25 int,
	population_age_26 int,
	population_age_27 int,
	population_age_28 int,
	population_age_29 int,
	population_age_30 int,
	population_age_31 int,
	population_age_32 int,
	population_age_33 int,
	population_age_34 int,
	population_age_35 int,
	population_age_36 int,
	population_age_37 int,
	population_age_38 int,
	population_age_39 int,
	population_age_40 int,
	population_age_41 int,
	population_age_42 int,
	population_age_43 int,
	population_age_44 int,
	population_age_45 int,
	population_age_46 int,
	population_age_47 int,
	population_age_48 int,
	population_age_49 int,
	population_age_50 int,
	population_age_51 int,
	population_age_52 int,
	population_age_53 int,
	population_age_54 int,
	population_age_55 int,
	population_age_56 int,
	population_age_57 int,
	population_age_58 int,
	population_age_59 int,
	population_age_60 int,
	population_age_61 int,
	population_age_62 int,
	population_age_63 int,
	population_age_64 int,
	population_age_65 int,
	population_age_66 int,
	population_age_67 int,
	population_age_68 int,
	population_age_69 int,
	population_age_70 int,
	population_age_71 int,
	population_age_72 int,
	population_age_73 int,
	population_age_74 int,
	population_age_75 int,
	population_age_76 int,
	population_age_77 int,
	population_age_78 int,
	population_age_79 int,
	population_age_80 int,
	population_age_81 int,
	population_age_82 int,
	population_age_83 int,
	population_age_84 int,
	population_age_85 int,
	population_age_86 int,
	population_age_87 int,
	population_age_88 int,
	population_age_89 int,
	population_age_90 int,
	population_age_91 int,
	population_age_92 int,
	population_age_93 int,
	population_age_94 int,
	population_age_95 int,
	population_age_96 int,
	population_age_97 int,
	population_age_98 int,
	population_age_99 int,
	population_age_100 int,
	primary key (country_index, year, sex),
	foreign key (country_index) references countries(country_index)
	on delete cascade
);
describe midyear_population_1yr;

load data local infile 'C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/international/midyear_population_age_sex_final.csv'
into table midyear_population_1yr
fields terminated by ','
lines terminated by '\r\n'
IGNORE 1 LINES;

show warnings;
-- select * from midyear_population_1yr limit 10;


-- Load midyear population:
select "----- Create table midyear_population -----";
drop table if exists midyear_population;
create table midyear_population (
	country_index int not null,
	country_code varchar(5),
	country_name varchar(255),
	year int not null,
	midyear_population int,
	primary key (country_index, year),
	foreign key (country_index) references countries(country_index)
	on delete cascade
);
describe midyear_population;

load data local infile 'C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/international/midyear_population_final.csv'
into table midyear_population
fields terminated by ','
lines terminated by '\r\n'
IGNORE 1 LINES;

show warnings;
select * from midyear_population limit 10;


-- Load life expectancy:
select "----- Create table life_expectancy -----";
drop table if exists life_expectancy;
create table life_expectancy (
	country_index int not null,
	country_code varchar(5),
	country_name varchar(255),
	year int not null,
	infant_mortality float,
	infant_mortality_male float,
	infant_mortality_female float,
	life_expectancy float,
	life_expectancy_male float,
	life_expectancy_female float,
	mortality_rate_under5 float,
	mortality_rate_under5_male float,
	mortality_rate_under5_female float,
	mortality_rate_1to4 float,
	mortality_rate_1to4_male float,
	mortality_rate_1to4_female float,
	primary key (country_index, year),
	foreign key (country_index) references countries(country_index)
	on delete cascade
);
describe life_expectancy;

load data local infile 'C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/international/mortality_life_expectancy_final.csv'
into table life_expectancy
fields terminated by ','
lines terminated by '\r\n'
IGNORE 1 LINES;

show warnings;
select * from life_expectancy limit 10;