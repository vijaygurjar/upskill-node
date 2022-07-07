const Joi = require('joi');

const productValidator = Joi.object({
  title: Joi.string().min(3).max(25).required().error(errors => {
    errors.forEach(err => {
      switch (err.code) {
        case "string.empty":
          err.message = "Product title should not be empty!";
          break;
        case "string.min":
          err.message = `Product title should have at least ${err.local.limit} characters!`;
          break;
        case "string.max":
          err.message = `Product title should have at most ${err.local.limit} characters!`;
          break;
        default:
          break;
      }
    });
    return errors;
  }),
  type: Joi.string().max(25).error(errors => {
    errors.forEach(err => {
      switch (err.code) {
        case "string.max":
          err.message = `Product type should have at most ${err.local.limit} characters!`;
          break;
        default:
          break;
      }
    });
    return errors;
  }),
  description: Joi.string(),
  pic: Joi.string(),
  price: Joi.number().default(0),
  rating: Joi.number().default(0),
  stock: Joi.number().default(0),
  status: Joi.boolean().default(true)
})
module.exports = productValidator;