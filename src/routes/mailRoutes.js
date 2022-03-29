const express = require('express');

const router = express.Router();
const mailController = require('../controllers/mailController');
const {
  MAIL: {
    RESET_PASSWORD,
  },
} = require('../constants/routes');

/* /mail/resetPassword */
router.post(RESET_PASSWORD, mailController.resetPassword);

module.exports = router;
