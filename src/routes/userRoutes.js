const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const { verifyAccessToken, verifyRefreshToken } = require('../middlewares/tokenMiddleware');
const {
  USER: {
    REGISTRATION,
    LOGIN,
    REFRESH_USER_TOKEN,
    UPDATE_USER,
    GET_USER,
    LOGOUT_USER,
  },
} = require('../constants/routes');
const tokenController = require('../controllers/tokenController');
const { validationMiddleware } = require('../middlewares/validationMiddleware');
const { userRegisterSchema, userLoginSchema } = require('../validation/userSchema');

/* /user/register */
router.post(REGISTRATION, validationMiddleware(userRegisterSchema), userController.registerUser);

/* /user/login */
router.post(LOGIN, validationMiddleware(userLoginSchema), userController.loginUser);

/* /user/refresh */
router.post(REFRESH_USER_TOKEN, verifyRefreshToken, tokenController.refreshUserToken);

/* /user/update */
router.post(UPDATE_USER, verifyAccessToken, userController.updateUser);

/* /user/logout/ */
router.post(LOGOUT_USER, verifyAccessToken, userController.logoutUser);

/* /user/ */
router.get(GET_USER, verifyAccessToken, userController.getUser);

module.exports = router;
