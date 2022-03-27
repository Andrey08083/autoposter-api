const joi = require('joi');

/**
 * Should start with an alphabet
 * All other characters can be alphabets, numbers or an underscore
 * 5 to 30 characters
 */
const nameRegex = /^[^\s][A-Za-z][ A-Za-z_]{5,30}$/;

/**
 * At least one number
 * At least one capital letter
 * Any character expect line breaks
 * 5 chars min
 */
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/;

const userLoginSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  password: joi.string().regex(passwordRegex).required(),
});

const userRegisterSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  userName: joi.string().regex(nameRegex).required(),
  password: joi.string().regex(passwordRegex).required(),
});

const userUpdateSchema = joi.object({
  userName: joi.string().regex(nameRegex),
  password: joi.string().regex(passwordRegex),
  options: joi.object({
    timezone: joi.string(), // TODO: Add valid timezones
  }),
});

module.exports = {
  userLoginSchema,
  userRegisterSchema,
  userUpdateSchema,
};
