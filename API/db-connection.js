// Connect to MySQL Database
const mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mye030_countries_stats"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to DB!");
});

module.exports = connection;