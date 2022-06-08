const bcrypt = require('bcrypt');
const userService = require('../services/userService');
const tokenService = require('../services/tokenService');
const workspaceService = require('../services/workspaceService');
const telegramPostService = require('../services/telegramPostService');

const { NOT_FOUND, OK } = require('../constants/responseStatus');

const getUsers = async (req, res) => {
  const users = await userService.find({});

  return res.send(users);
};

const getPostsByUserId = async (req, res) => {
  const { userId } = req.params;
  const user = await userService.findOneById(userId);

  if (!user) {
    return res.sendStatus(NOT_FOUND);
  }

  const workspace = await workspaceService.getWorkspaceByUserId(user._id);

  const posts = await telegramPostService.getTelegramPostsByWorkspaceId(workspace._id);

  return res.send(posts);
};

const changeUserPassword = async (req, res) => {
  const { userId, password } = req.body;
  const user = await userService.findOneById(userId);

  if (!user) {
    return res.sendStatus(NOT_FOUND);
  }

  const hashedPassword = await bcrypt.hash(password, process.env.BCRYPT_SALT);

  user.password = hashedPassword;

  await user.save();
  await tokenService.deleteMany({ user: user._id });
  return res.sendStatus(OK);
};

module.exports = {
  getUsers,
  getPostsByUserId,
  changeUserPassword,
};
