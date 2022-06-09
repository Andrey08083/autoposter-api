const bot = require('../bot');
const BaseService = require('./baseService');

const telegramPostModel = require('../models/telegramPost');

const telegramChannelService = require('./telegramChannelService');

const { ERROR, SENT } = require('../constants/postStatus');

class TelegramPostService extends BaseService {
  async getTelegramPostsByWorkspaceId(workspaceId) {
    const channels = await telegramChannelService.getLinkedTelegramChannelsToWorkspace(workspaceId);
    const defaultImage = await telegramChannelService.getTelegramDefaultImage();

    const posts = await this.find({
      workspace: workspaceId,
    }).sort({ _id: -1 }).lean();

    return posts.map((post) => {
      const channel = channels
        .find(({ id: telegramChannelId }) => telegramChannelId === post.channelId);

      return {
        ...post,
        title: channel?.title || 'Channel not found',
        channelPhoto: channel?.photo || defaultImage,
      };
    });
  }

  async sendTelegramPost(telegramPost) {
    const { channelId, text, buttons } = telegramPost;
    try {
      await bot.sendMessage(channelId, text, {
        parse_mode: 'html',
        reply_markup: {
          inline_keyboard: [buttons],
        },
      });

      telegramPost.status = SENT;
      await telegramPost.save();
    } catch (e) {
      telegramPost.status = ERROR;
      await telegramPost.save();
    }
  }
}

module.exports = new TelegramPostService(telegramPostModel);
