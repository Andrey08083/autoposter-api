const express = require('express');

const router = express.Router();
const telegramController = require('../controllers/telegramController');
const { verifyAccessToken } = require('../middlewares/tokenMiddleware');
const {
  TELEGRAM: {
    GET_TELEGRAM_CHANNELS,
    CONNECT_TELEGRAM,
    SEND_POST,
  },
} = require('../constants/routes');

/* /workspace/telegram/channels */
router.get(GET_TELEGRAM_CHANNELS, verifyAccessToken, telegramController.getTelegramChannels);

/* /workspace/telegram/connect */
router.get(CONNECT_TELEGRAM, verifyAccessToken, telegramController.getTelegramConnectToken);

/* /workspace/telegram/sendPost */
router.post(SEND_POST, verifyAccessToken, telegramController.sendPostToTelegramChannel);

module.exports = router;
