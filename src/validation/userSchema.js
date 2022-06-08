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
  email: joi.string()
    .email()
    .lowercase()
    .label('emailValidation')
    .required(),
  password: joi.string().required(),
});

const userRegisterSchema = joi.object({
  email: joi.string()
    .email()
    .lowercase()
    .label('emailValidation')
    .required(),
  userName: joi.string()
    .regex(nameRegex)
    .label('userNameValidation')
    .required(),
  password: joi.string()
    .regex(passwordRegex)
    .label('passwordValidation')
    .required(),
});

const changeUserPasswordSchema = joi.object({
  userId: joi.string().required(),
  password: joi.string()
    .regex(passwordRegex)
    .label('passwordValidation')
    .required(),
});

module.exports = {
  userLoginSchema,
  userRegisterSchema,
  changeUserPasswordSchema,
};
