const integrationService = require('./integrationService');
const telegramChannelModel = require('../models/telegramChannel');
const BaseService = require('./baseService');

class TelegramChannelService extends BaseService {
  async getLinkedTelegramChannelsToWorkspace(workspaceId) {
    const bot = require('../bot');

    const telegramIntegration = await integrationService.findOne({
      workspace: workspaceId,
      integrationType: 'Telegram',
    });

    if (!telegramIntegration) {
      return [];
    }

    const telegramChannels = await this.model.find({ integration: telegramIntegration._id }) || [];

    const promises = [];

    telegramChannels.forEach((telegramChannel) => {
      promises.push(bot.getChat(telegramChannel.channelId).catch(() => ({ id: telegramChannel.channelId, title: 'Cannot get channel' })));
    });

    return Promise.all(promises);
  }
}

module.exports = new TelegramChannelService(telegramChannelModel);
