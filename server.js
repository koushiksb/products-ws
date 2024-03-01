const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { default: helmet } = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const cors = require('cors');
const ErrorHandler = require('./utils/errorHandler');
const errorMiddleware = require('./middlewares/errors');
const connectDatabase = require('./config/database');
const logger = require('./utils/logger');
const app = express();

dotenv.config({ path : "./config/config.env" });

connectDatabase();

// Handling Uncaught Exception
process.on('uncaughtException', err => {
    console.error(`ERROR: ${err.message}`);
    console.error('Shutting down due to uncaught exception.')
    process.exit(1);
});

// Set up body parser
app.use(bodyParser.urlencoded({ extended : true }));

app.use(express.static('public'));

// Setup security headers
app.use(helmet());

// Setup body parser
app.use(express.json());

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xssClean());

// Prevent Parameter Pollution
app.use(hpp({
    whitelist: ['positions']
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10*60*1000, //10 Mints
    max : 100
});

// Setup CORS - Accessible by other domains
app.use(cors());

app.use(limiter);

app.use('/api/v1', require('./routes/products.routes'));

app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
})

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000; 

const server = app.listen(PORT, () => {
    logger.info(`server started on port ${process.env.PORT}`);
})


// Handling Unhandled Promise Rejection
process.on('unhandledRejection', err => {
    logger.error(`Error: ${err.message}`);
    logger.error('Shutting down the server due to Unhandled promise rejection.')
    server.close( () => {
        process.exit(1);
    }) 
});