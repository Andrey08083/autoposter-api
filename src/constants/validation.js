module.exports = {
  STATUS: {
    SUCCESS: 'SUCCESS',
    FAIL: 'FAIL',
  },

  ERRORS: {
    EMAIL_UNDEFINED: 'Email field is required',
    PASSWORD_UNDEFINED: 'Password field is required',
    USERNAME_UNDEFINED: 'Username field is required',
    FULL_NAME_UNDEFINED: 'Full name field is required',
    ID_UNDEFINED: 'User id is required',
    USER_NOT_FOUND: 'User not found',
    USERS_NOT_FOUND: 'Users not found',
    WRONG_PASSWORD: 'Wrong password',
    INVALID_EMAIL: 'Invalid email',
    INVALID_USERNAME: 'Invalid username',
    INVALID_FULL_NAME: 'Invalid full name',
    EMAIL_ALREADY_TAKEN: 'Email already taken',
    VALIDATION_ERROR: 'Validation error',
    USERNAME_ALREADY_TAKEN: 'Username already taken',
    USER_NOT_AUTHORIZED: 'User not authorized',
    ALREADY_LOGGED_OUT: 'Already logged out',
    USER_NOT_CONFIRMED: 'User not confirmed',
    ACCESS_DENIED: 'Access denied',
    TOKEN_NOT_FOUND: 'Token not found',

    TELEGRAM_CHANNEL_NOT_FOUND: 'Telegram channel not found',
  },
  CUSTOM_ERROR_MESSAGES: {
    'email.emailValidation': 'Incorrect email',
    'userName.userNameValidation': 'Incorrect username. '
      + 'Should consist from two words, e.g. First name, Last name',
    'password.passwordValidation': 'Incorrect password. Requirements: '
      + 'At least one number, '
      + 'At least one capital letter, '
      + 'Any character expect line breaks, '
      + '5 chars min',
  },
};
