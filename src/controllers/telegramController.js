const workspaceService = require('../services/workspaceService');
const integrationService = require('../services/integrationService');
const telegramChannelService = require('../services/telegramChannelService');
const bot = require('../bot');
const { OK, BAD_REQUEST } = require('../constants/responseStatus');
const ApiError = require('../helpers/apiError');
const { ERRORS } = require('../constants/validation');
const {removeHtmlTagsRegExp} = require("../constants/regExp");

const getTelegramChannels = async (req, res, next) => {
  try {
    const workspace = await workspaceService.findOne({ user: req.user._id });
    const telegramChannels = await telegramChannelService.getLinkedTelegramChannelsToWorkspace(
      workspace._id,
    );
    res.send(telegramChannels);
  } catch (e) {
    next(e);
  }
};

const getTelegramConnectToken = async (req, res, next) => {
  try {
    const workspace = await workspaceService.findOne({ user: req.user._id });

    const telegramIntegration = await integrationService.createTelegramIntegrationIfNotExists(
      workspace._id,
    );

    const telegramConnectToken = [req.user._id, workspace._id, telegramIntegration._id].join('-');

    res.send({
      connectToken: telegramConnectToken,
    });
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
      next(new ApiError(ERRORS.TELEGRAM_CHANNEL_NOT_FOUND, BAD_REQUEST));
    }

    if (telegramChannel.integration.workspace.toString() !== workspace._id.toString()) {
      next(new ApiError(ERRORS.TELEGRAM_CHANNEL_NOT_FOUND, BAD_REQUEST));
    }

    const preparedMessage = postText.replace(removeHtmlTagsRegExp, '');

    await bot.sendMessage(channelId, preparedMessage, { parse_mode: 'html' });
    res.sendStatus(OK);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getTelegramChannels,
  getTelegramConnectToken,
  sendPostToTelegramChannel,
};
