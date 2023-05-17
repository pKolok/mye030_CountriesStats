const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const AppError = require('./shared/appError');
const glabalErrorHandler = require('./controllers/errorControllers');
const countriesRouter = require('./routes/countriesRoutes');
const yearsRouter = require('./routes/yearsRoutes');
const statisticsRouter = require('./routes/statisticsRoutes');

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
app.use('/api/v1/years', yearsRouter);
app.use('/api/v1/statistics', statisticsRouter);

// Handler for all routes not handled before/above
app.all('*', (req, res, next) => {
    next(new AppError(`Can not find ${req.originalUrl} on the server!`, 404));
});

// Global error handling middleware (errors other than wrong routes)
app.use(glabalErrorHandler);

module.exports = app;