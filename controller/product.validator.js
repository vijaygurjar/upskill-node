const Joi = require('joi');

const productValidator = Joi.object({
    title: Joi.string().min(3).max(25).required().error(errors => {
      errors.forEach(err => {
        switch (err.code) {
          case "string.empty":
            err.message = "First name should not be empty!";
            break;
          case "string.min":
            err.message = `First name should have at least ${err.local.limit} characters!`;
            break;
          case "string.max":
            err.message = `First name should have at most ${err.local.limit} characters!`;
            break;
          default:
            break;
        }
      });
      return errors;
    }),
    type: Joi.string().min(3).max(25).required().error(errors => {
      errors.forEach(err => {
        switch (err.code) {
          case "string.empty":
            err.message = "Last name should not be empty!";
            break;
          case "string.min":
            err.message = `Last name should have at least ${err.local.limit} characters!`;
            break;
          case "string.max":
            err.message = `Last name should have at most ${err.local.limit} characters!`;
            break;
          default:
            break;
        }
      });
      return errors;
    }),
    description: Joi.string(),
    filename: Joi.string(),
    price: Joi.number().default(0),
    rating: Joi.number().default(0),
    status: Joi.boolean().default(true)
})
module.exports = productValidator;