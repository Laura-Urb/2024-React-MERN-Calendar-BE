const moment = require('moment');

const isDate = (value) => {
  if (value) {
    const date = moment(value);
    return date.isValid();
  } else {
    return false;
  }
};

module.exports = {
  isDate,
};
