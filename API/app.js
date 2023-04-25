const express = require('express');
const cors = require('cors');

const countriesRouter = require('./routes/countriesRoutes');
const demographicsRouter = require('./routes/demographicsRoutes');
const incomeRouter = require('./routes/incomeRoutes');

const app = express();

// use it before all route definitions (grants access to below url)
app.use(cors({origin: 'http://localhost:4200'}));

app.get('/', (req, res) => {
    res.status(200).json({message: "Hello from the server!"});
});

// const getCityByName = (req, res) => {
//     const query = `select * from city where Name='${req.params.cityName}';`;
//     connection.query(query, (err, rows) => {
//         if (err) throw err;
//         res.status(200).json({
//             status: 'success',
//             results: rows.length,
//             data: {
//                 cities: JSON.parse(JSON.stringify(rows))
//             }
//         });
//     });
// };

// app.get('/api/v1/cities/:cityName', getCityByName);

app.use('/api/v1/countries', countriesRouter);
app.use('/api/v1/demographics', demographicsRouter);
app.use('/api/v1/income', incomeRouter);

app.all('*', (req, res, next) => {
    console.log(req.originalUrl);
})

const port = 3000;
app.listen(port, () => {
    console.log(`Listening to requests on port ${port}`);
})