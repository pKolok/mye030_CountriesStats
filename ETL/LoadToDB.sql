-- To run sql scripts from cmd:
-- source C:/Users/panou/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/mye030_CountriesStats/ETL/LoadToDB.sql;
-- source C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/mye030_CountriesStats/ETL/LoadToDB.sql;

drop database if exists mye030_countries_stats;
create database mye030_countries_stats;
use mye030_countries_stats;

create table countries (
	country_index int not null,
	iso varchar(5),
	iso3 varchar(5),
	iso_code int,
	fips varchar(5),
	display_name varchar(255),
	official_name varchar(255),
	capital varchar(255),
	continent varchar(255),
	currency_code varchar(5),
	currency_name varchar(255),
	phone varchar(20),
	region_code int,
	region_name varchar(255),
	sub_region_code int,
	sub_region_name  varchar(255),
	intermediate_region_code int,
	intermediate_region_name varchar(255),
	status varchar(255),
	developed_or_developing varchar(255),
	small_island_developing_states_sids  varchar(10),
	land_locked_developing_countries_lldc  varchar(10),
	least_developed_countries_ldc varchar(10),
	area_sqkm int,
	population int,
	primary key (country_index)
);

show tables;
describe countries;


-- steps to connect before importing data from file:
-- from cmd: mysql -u root -p
-- SET GLOBAL local_infile=1;
-- quit
-- reconnect: mysql --local-infile=1 -u username -p

-- Load Countries data
load data local infile 'C:/Users/panousias/Dropbox/02_Edu/01_Uni/06_UoI/04_Courses/MYE030/Project/Data/countries/countriesFinal.csv'
into table countries
fields terminated by ','
optionally enclosed by '"'
lines terminated by '\r\n'
IGNORE 1 LINES;

show warnings;
select * from countries limit 10;

-- Load international DATABASE
