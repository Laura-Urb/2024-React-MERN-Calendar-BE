const { response } = require('express');
const { validationResult } = require('express-validator');

const validateFields = (req, res = response, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
  }
};

module.exports = {
  validateFields,
};
