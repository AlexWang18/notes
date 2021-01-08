// put custom middleware functions to their own module
const logger = require('./logger');

const requestLogger = (req, res, next) => {
  logger.info('Method: ', req.method);
  logger.info('Path: ', req.path);
  logger.info('Body: ', req.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  // this isnt even techically middlware as its more of a response and missing next param,
  // blurred lines with how express interprets what it uses.
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error); // pass to default express error handler
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
