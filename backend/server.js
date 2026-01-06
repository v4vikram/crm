const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const config = require('./src/config');
const { errorHandler } = require('./src/middlewares/errorMiddleware');
const routes = require('./src/routes');

const app = express();

// Middleware
app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173", // frontend URL
        credentials: true,               // 🔥 REQUIRED for cookies
    })
);

app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.use('/api', routes);

// Error Handling
app.use(errorHandler);

// Database Connection
mongoose
    .connect(config.mongoURI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
        });
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
    });
