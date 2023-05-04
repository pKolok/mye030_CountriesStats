const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const countriesRouter = require('./routes/countriesRoutes');
const demographicsRouter = require('./routes/demographicsRoutes');
const incomeRouter = require('./routes/incomeRoutes');

const app = express();

// ----- Middleware ----- //
// Http request logger middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// use it before all route definitions (grants access to below url)
app.use(cors({origin: 'http://localhost:4200'}));

app.get('/', (req, res) => {
    res.status(200).json({message: "Hello from the server!"});
});

// Mounting routers by route
app.use('/api/v1/countries', countriesRouter);
app.use('/api/v1/demographics', demographicsRouter);
app.use('/api/v1/income', incomeRouter);

app.all('*', (req, res, next) => {
    console.log(req.originalUrl);
})

module.exports = app;