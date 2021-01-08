const express = require('express');
const config = require('./utils/config');

const app = express();

const cors = require('cors');
const router = require('./controllers/notes');

const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

const mongoose = require('mongoose');

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
})
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build')); // when receiving a get request express will check build directory to see if there are files to respond to request i.e images/html/js
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/notes', router);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
