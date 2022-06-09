const request = require('request-promise-native').defaults({ encoding: null });

const bot = require('../bot');

const integrationService = require('./integrationService');
const telegramChannelModel = require('../models/telegramChannel');
const BaseService = require('./baseService');

class TelegramChannelService extends BaseService {
  async getLinkedTelegramChannelsToWorkspace(workspaceId) {
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
      promises.push(bot.getChat(telegramChannel.channelId).catch(() => ({ id: telegramChannel.channelId, title: 'Cannot get channel', photo: '' })));
    });

    const channels = await Promise.all(promises);

    const channelsWithImages = await Promise.all(channels.map(async (channel) => {
      channel.photo = await this.getTelegramChannelImageById(channel.id);
      return channel;
    }));

    return channelsWithImages;
  }

  async getTelegramChannelImageById(channelId) {
    const channel = await bot.getChat(channelId).catch(() => ({ id: channelId, title: 'Cannot get channel', photo: '' }));
    if (channel?.photo?.big_file_id) {
      return (await request.get(await bot.getFileLink(channel.photo.big_file_id))).toString('base64');
    }

    return await this.getTelegramDefaultImage();
  }

  async getTelegramDefaultImage() {
    return (await request.get('https://i0.wp.com/www.charitycomms.org.uk/wp-content/uploads/2019/02/placeholder-image-square.jpg')).toString('base64');
  }
}

module.exports = new TelegramChannelService(telegramChannelModel);
