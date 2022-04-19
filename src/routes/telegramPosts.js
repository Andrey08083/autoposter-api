const express = require('express');

const router = express.Router();

const telegramPostsController = require('../controllers/telegramPostsController');

const {
  POSTS: {
    SEND_POST,
  },
} = require('../constants/routes');

router.get('/', telegramPostsController.getPosts);

/* /workspace/telegram/posts/sendPost */
router.post(SEND_POST, telegramPostsController.sendPostToTelegramChannel);

module.exports = router;
