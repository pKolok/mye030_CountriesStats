var mysql = require('mysql');
const express = require('express');
var http = require('http');
const url = require('url');

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

// Server
// The callback function is exectuted every time a request hits the server
// const server = http.createServer((req, res) => {
//    
//     const url = req.url;
//
//     if (url === "/") {
//         // res.end("Hello from the server");
//         res.end("Hello from the server");
//     } else if (url === "/api") {
//
//         const query = "select * from country limit 5;";
//         connection.query(query, (err, rows) => {
//             if (err) throw err;
//
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.write(JSON.stringify(rows));
//             res.end();
//         });
//     } else {
//         res.writeHead(404, {
//             'Content-type': 'text/html'
//         });
//         res.end('<h1>Page not found</h1>');
//     }
//
// });
//
// server.listen(8000, '127.0.0.1', () => {
//     console.log('Listening to requests on port 8000');
// });


app.get('/', (req, res) => {
    // res.status(200).send("Hello from the server!");
    res.status(200).json({message: "Hello from the server!"});
});

app.get('/api', (req, res) => {
    const query = "select * from country limit 5;";
    connection.query(query, (err, rows) => {
        if (err) throw err;
        res.json(JSON.parse(JSON.stringify(rows)));
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Listening to requests on port ${port}`);
})