const express = require('express');

const adminController = require('../controllers/adminController');

const { verifyAccessToken } = require('../middlewares/tokenMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const { ADMIN: ADMIN_ROUTE } = require('../constants/routes');
const { ADMIN } = require('../constants/userRoles');
const { validationMiddleware } = require('../middlewares/validationMiddleware');
const { changeUserPasswordSchema } = require('../validation/userSchema');

const router = express.Router();

router.use(verifyAccessToken, roleMiddleware(ADMIN));

router.get(ADMIN_ROUTE.USERS, adminController.getUsers);

router.get(ADMIN_ROUTE.POSTS_BY_USER_ID, adminController.getPostsByUserId);

router.post(
  ADMIN_ROUTE.CHANGE_USER_PASSWORD,
  validationMiddleware(changeUserPasswordSchema),
  adminController.changeUserPassword,
);

module.exports = router;
