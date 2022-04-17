const telegramChannelModel = require('../models/telegramChannel');
const BaseService = require('./baseService');

class TelegramChannelService extends BaseService {
  async getLinkedTelegramChannelsToWorkspace(workspaceId) {
    const bot = require('../bot');

    const telegramChannels = await this.model.find({ workspace: workspaceId }) || [];
    const promises = [];

    telegramChannels.forEach((telegramChannel) => {
      promises.push(bot.getChat(telegramChannel.channelId));
    });

    return Promise.all(promises);
  }
}

module.exports = new TelegramChannelService(telegramChannelModel);
