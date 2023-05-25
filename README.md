![Alt text](Angular/src/assets/images/Globe.jpg?raw=true)

# A World of Statistics
Visualisation of demographic and economic statistics for the countries of the world.

# Contributors
Panagiotis Kolokouris  
AM: 4914  

Department of Computer Science & Engineering,  
University of Ioannina

# Project Stucture
The project is devided into three sub-projects:
1. Extract - Transform - Load (ETL) the data (Python & MySQL)
2. Database API (NodeJS)
3. Web Application (Angular & d3)

## Extract - Transfort - Load (ETL)
This ETL sub-project includes:

* A Python (version 3) program to read the raw data, process, normalise, transform and save the read-to-load data into the database.
* Sql scripts to create the mySQL database schema and load the read-to-load data into the database.

**Raw Data**  
The raw data are located in `src/Data/original/` split between folders:
* countries
* international
* income

**Python Program Execution**  
To run via the command line perform the following (from the project directory `src/ETL`):
```
pip3 install pandas
pip3 install openpyxl
python main.py
```

The program execution will generate the processed data in `src/Data/processed/` split between folders:
* countries
* international
* income

## Database API
A server is set up in Node JS to respond to http requests based on an API.

The API documentation is published [here](https://documenter.getpostman.com/view/25718180/2s93kxd6vE).

## Web Application
A web application is developed in Angular to provide visualisation of the available statistics based on the user choice of countries, statistics and time period.

The application is capable of generating the following graphs:
* Line charts
* Bar charts
* Scatter plots