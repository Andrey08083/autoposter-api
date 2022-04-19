const express = require('express');

const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const telegramRoutes = require('./telegramRoutes');
const { verifyAccessToken } = require('../middlewares/tokenMiddleware');
const {
  WORKSPACE: {
    GET_WORKSPACE,
  },
  TELEGRAM: {
    TELEGRAM_ROUTER,
  },
} = require('../constants/routes');

/* /workspace/ */
router.get(GET_WORKSPACE, verifyAccessToken, workspaceController.getWorkspace);

/* /workspace/telegram/* */
router.use(TELEGRAM_ROUTER, verifyAccessToken, telegramRoutes);

module.exports = router;
