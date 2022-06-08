const express = require('express');

const router = express.Router();

const telegramPostsController = require('../controllers/telegramPostsController');

const { validationMiddleware } = require('../middlewares/validationMiddleware');
const { telegramPostSchema, telegramPostScheduleSchema } = require('../validation/telegramPostSchema');

const {
  POSTS: {
    SEND_POST,
    SCHEDULE_POST,
    SEND_POST_BY_ID,
    DELETE_POST_BY_ID,
  },
} = require('../constants/routes');

router.get('/', telegramPostsController.getPosts);

/* /workspace/telegram/posts/sendPost */
router.post(
  SEND_POST,
  validationMiddleware(telegramPostSchema),
  telegramPostsController.sendPostToTelegramChannel,
);

/* /workspace/telegram/posts/schedule */
router.post(
  SCHEDULE_POST,
  validationMiddleware(telegramPostScheduleSchema),
  telegramPostsController.schedulePostToTelegramChannel,
);

/* /workspace/telegram/posts/:postId/send */
router.post(
  SEND_POST_BY_ID,
  telegramPostsController.sendPostById,
);

/* /workspace/telegram/posts/:postId */
router.delete(
  DELETE_POST_BY_ID,
  telegramPostsController.deletePostById,
);

module.exports = router;
