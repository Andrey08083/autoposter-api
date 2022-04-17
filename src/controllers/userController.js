const userService = require('../services/userService');
const workspaceService = require('../services/workspaceService');

const loginUser = async (req, res, next) => {
  try {
    const { body } = req;
    const loginResult = await userService.loginUser(body);

    return res.send(loginResult);
  } catch (e) {
    return next(e);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { body } = req;
    const user = await userService.registerUser(body);
    await workspaceService.create({ user: user._id });
    return res.send(user);
  } catch (e) {
    return next(e);
  }
};

const getUser = (req, res) => res.send(req.user);

const updateUser = async (req, res) => {
  res.send();
};

const logoutUser = async (req, res, next) => {
  try {
    const { user, token } = req;
    const logoutResult = await userService.logoutUser(user._id, token.accessToken);
    return res.send(logoutResult);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  loginUser,
  registerUser,
  getUser,
  updateUser,
  logoutUser,
};
