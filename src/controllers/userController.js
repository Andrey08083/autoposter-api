const userService = require('../services/userService');

const loginUser = async (req, res, next) => {
  try {
    const { body } = req;
    const loginResult = await userService.loginUser(body);

    return res.status(loginResult.getStatus()).send(loginResult.getData());
  } catch (e) {
    return next(e);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { body } = req;
    const registerResult = await userService.registerUser(body);
    return res.status(registerResult.getStatus()).send(registerResult.getData());
  } catch (e) {
    return next(e);
  }
};

const getUser = (req, res) => res.send(req.user);

const updateUser = async (req, res) => {
  res.send();
};

const logoutUser = async (req, res) => {
  await userService.logoutUser(req.user._id, req.token._id)
};

module.exports = {
  loginUser,
  registerUser,
  getUser,
  updateUser,
  logoutUser,
};
