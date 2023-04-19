var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "world"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to DB!");

    var query = "select * from country limit 10;";
    con.query(query, function(err, result) {
        if (err) throw err;
        console.log(result);
    })
});
