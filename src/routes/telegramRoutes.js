const express = require('express');

const router = express.Router();
const telegramController = require('../controllers/telegramController');
const telegramPostsRouter = require('./telegramPosts');

const {
  POSTS: {
    POSTS_ROUTER,
  },
  TELEGRAM: {
    GET_TELEGRAM_CHANNELS,
    CONNECT_TELEGRAM,
  },
} = require('../constants/routes');

/* /workspace/telegram/channels */
router.get(GET_TELEGRAM_CHANNELS, telegramController.getTelegramChannels);

/* /workspace/telegram/connect */
router.get(CONNECT_TELEGRAM, telegramController.getTelegramConnectToken);

/* /workspace/telegram/posts/* */
router.use(POSTS_ROUTER, telegramPostsRouter);

module.exports = router;
