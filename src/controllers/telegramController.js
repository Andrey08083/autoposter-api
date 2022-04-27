const workspaceService = require('../services/workspaceService');
const integrationService = require('../services/integrationService');
const telegramChannelService = require('../services/telegramChannelService');
const { NOT_FOUND, OK } = require('../constants/responseStatus');

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

const removeTelegramChannelById = async (req, res, next) => {
  try {
    const { telegramChannelId } = req.params;
    const integration = await integrationService.findOne({ workspace: req.workspace._id });

    const deleteResult = await telegramChannelService.deleteOne({
      channelId: telegramChannelId,
      integration: integration._id,
    });

    if (deleteResult.deletedCount) {
      return res.sendStatus(OK);
    }

    return res.sendStatus(NOT_FOUND);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getTelegramChannels,
  getTelegramConnectToken,
  removeTelegramChannelById,
};
