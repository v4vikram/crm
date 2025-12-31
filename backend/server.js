const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./src/config');
const { errorHandler } = require('./src/middlewares/errorMiddleware');

// Import Routes
const authRoutes = require('./src/routes/auth.routes');
const leadRoutes = require('./src/routes/lead.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

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
