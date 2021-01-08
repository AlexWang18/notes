// seperate printing into console to own module have it all in place in case want to use graylog

const info = (...args) => { // rest syntax puts elements into a single arr
  console.log(...args);
};

const error = (...args) => {
  console.error(...args);
};

module.exports = {
  info,
  error,
};
