const express = require('express');

const router = express.Router();
const { verifyAccessToken, verifyRefreshToken } = require('../middlewares/tokenMiddleware');
const {
  TOKEN: {
    ACCESS_TOKEN,
    REFRESH_TOKEN,
  },
} = require('../constants/routes');

/* /token/accessToken */
router.post(
  ACCESS_TOKEN,
  verifyAccessToken,
  (req, res) => res.send({ user: req.user, token: req.token }),
);
/* /token/refreshToken */
router.post(
  REFRESH_TOKEN,
  verifyRefreshToken,
  (req, res) => res.send({ user: req.user, token: req.token }),
);

module.exports = router;
