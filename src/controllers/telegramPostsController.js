const workspaceService = require('../services/workspaceService');
const telegramChannelService = require('../services/telegramChannelService');
const telegramPostService = require('../services/telegramPostService');
const ApiError = require('../helpers/apiError');
const { ERRORS } = require('../constants/validation');
const { BAD_REQUEST, OK } = require('../constants/responseStatus');
const { removeHtmlTagsRegExp } = require('../constants/regExp');
const bot = require('../bot');

const getPosts = async (req, res, next) => {
  try {
    const { workspace } = req;

    const posts = await telegramPostService.getTelegramPostsByWorkspaceId(workspace._id);

    res.send(posts);
  } catch (e) {
    next(e);
  }
};

const sendPostToTelegramChannel = async (req, res, next) => {
  try {
    const { channelId, postText } = req.body;

    const workspace = await workspaceService.findOne({ user: req.user._id });

    const telegramChannel = await telegramChannelService.findOne({
      channelId,
    }).populate('integration');

    if (!telegramChannel) {
      return next(new ApiError(BAD_REQUEST, ERRORS.TELEGRAM_CHANNEL_NOT_FOUND));
    }

    if (telegramChannel.integration.workspace.toString() !== workspace._id.toString()) {
      return next(new ApiError(BAD_REQUEST, ERRORS.TELEGRAM_CHANNEL_NOT_FOUND));
    }

    const preparedMessage = postText.replace(removeHtmlTagsRegExp, '');

    await bot.sendMessage(channelId, preparedMessage, { parse_mode: 'html' });

    await telegramPostService.create({
      workspace: workspace._id,
      channelId,
      text: preparedMessage,
    });

    return res.sendStatus(OK);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getPosts,
  sendPostToTelegramChannel,
};