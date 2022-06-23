const Joi = require('joi');

const userValidator = Joi.object({
    firstname: Joi.string().alphanum().max(25).default('abc').error(errors => {
      errors.forEach(err => {
        switch (err.code) {
          case "string.max":
            err.message = `First name should have at most ${err.local.limit} characters!`;
            break;
          default:
            break;
        }
      });
      return errors;
    }),
    lastname: Joi.string().alphanum().max(25).default('xyz').error(errors => {
      errors.forEach(err => {
        switch (err.code) {
          case "string.max":
            err.message = `Last name should have at most ${err.local.limit} characters!`;
            break;
          default:
            break;
        }
      });
      return errors;
    }),
    email: Joi.string().email().trim(true).required().error(errors => {
      errors.forEach(err => {
        switch (err.code) {
          case "string.email":
            err.message = "Email id is not valid!";
            break;
          case "string.empty":
            err.message = "Email id should not be empty!";
            break;
          case "string.min":
            err.message = `Email id should have at least ${err.local.limit} characters!`;
            break;
          case "string.max":
            err.message = `Email id should have at most ${err.local.limit} characters!`;
            break;
          default:
            break;
        }
      });
      return errors;
    }),
    password: Joi.string().alphanum().min(8).required().error(errors => {
      errors.forEach(err => {
        switch (err.code) {
          case "string.empty":
            err.message = "Password should not be empty!";
            break;
          case "string.alphanum":
            err.message = `Special Characters not allowed in password`;
            break;
          case "string.min":
            err.message = `Password should have at least ${err.local.limit} characters!`;
            break;
          case "string.max":
            err.message = `Password should have at most ${err.local.limit} characters!`;
            break;
          default:
            break;
        }
      });
      return errors;
    }),
    gender: Joi.string().default('M'),
    status: Joi.boolean().default(true)
})

const loginValidator = Joi.object({
  email: Joi.string().email().trim(true).required().error(errors => {
    errors.forEach(err => {
      switch (err.code) {
        case "string.email":
          err.message = "Email id is not valid!";
          break;
        case "string.empty":
          err.message = "Email id should not be empty!";
          break;
        case "string.min":
          err.message = `Email id should have at least ${err.local.limit} characters!`;
          break;
        case "string.max":
          err.message = `Email id should have at most ${err.local.limit} characters!`;
          break;
        default:
          break;
      }
    });
    return errors;
  }),
  password: Joi.string().alphanum().min(8).required().error(errors => {
    errors.forEach(err => {
      switch (err.code) {
        case "string.empty":
          err.message = "Password should not be empty!";
          break;
        case "string.alphanum":
          err.message = `Special Characters not allowed in password`;
          break;
        case "string.min":
          err.message = `Password should have at least ${err.local.limit} characters!`;
          break;
        case "string.max":
          err.message = `Password should have at most ${err.local.limit} characters!`;
          break;
        default:
          break;
      }
    });
    return errors;
  })
})

const logoutValidator = Joi.object({
  email: Joi.string().email().trim(true).required().error(errors => {
    errors.forEach(err => {
      switch (err.code) {
        case "string.email":
          err.message = "Email id is not valid!";
          break;
        case "string.empty":
          err.message = "Email id should not be empty!";
          break;
        case "string.min":
          err.message = `Email id should have at least ${err.local.limit} characters!`;
          break;
        case "string.max":
          err.message = `Email id should have at most ${err.local.limit} characters!`;
          break;
        default:
          break;
      }
    });
    return errors;
  })
})

const userUpdateValidator = Joi.object({
  firstname: Joi.string().alphanum().max(25).default('abc').error(errors => {
    errors.forEach(err => {
      switch (err.code) {
        case "string.max":
          err.message = `First name should have at most ${err.local.limit} characters!`;
          break;
        default:
          break;
      }
    });
    return errors;
  }),
  lastname: Joi.string().alphanum().max(25).default('xyz').error(errors => {
    errors.forEach(err => {
      switch (err.code) {
        case "string.max":
          err.message = `Last name should have at most ${err.local.limit} characters!`;
          break;
        default:
          break;
      }
    });
    return errors;
  }),
  gender: Joi.string().default('M'),
  status: Joi.boolean().default(true)
})

module.exports = {
  userValidator,
  loginValidator,
  logoutValidator,
  userUpdateValidator
};