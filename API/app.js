const mysql = require('mysql');
const express = require('express');
const cors = require('cors');

// MySQL Database
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "world"
});
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to DB!");
});

const app = express();

// use it before all route definitions (grants access to below url)
app.use(cors({origin: 'http://localhost:4200'}));

app.get('/', (req, res) => {
    // res.status(200).send("Hello from the server!");
    res.status(200).json({message: "Hello from the server!"});
});

const getAllCities = (req, res) => {
    const query = "select * from city;";
    connection.query(query, (err, rows) => {
        if (err) throw err;
        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: {
                cities: JSON.parse(JSON.stringify(rows))
            }
        });
    });
};

const getCityByName = (req, res) => {
    const query = `select * from city where Name='${req.params.cityName}';`;
    connection.query(query, (err, rows) => {
        if (err) throw err;
        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: {
                cities: JSON.parse(JSON.stringify(rows))
            }
        });
    });
};

const getAllCountries = (req, res) => {
    const query = "select * from country;";
    connection.query(query, (err, rows) => {
        if (err) throw err;
        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: {
                countries: JSON.parse(JSON.stringify(rows))
            }
        });
    });
};

const getAllCountryLanguages = (req, res) => {
    const query = "select * from countryLanguage;";
    connection.query(query, (err, rows) => {
        if (err) throw err;
        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: {
                languages: JSON.parse(JSON.stringify(rows))
            }
        });
    });
};

app.get('/api/v1/cities', getAllCities);
app.get('/api/v1/cities/:cityName', getCityByName);
app.get('/api/v1/countries', getAllCountries);
app.get('/api/v1/countryLanguages', getAllCountryLanguages);

const port = 3000;
app.listen(port, () => {
    console.log(`Listening to requests on port ${port}`);
})