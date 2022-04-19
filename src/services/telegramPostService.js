const telegramPostModel = require('../models/telegramPost');
const BaseService = require('./baseService');

const telegramChannelService = require('./telegramChannelService');

class TelegramPostService extends BaseService {
  async getTelegramPostsByWorkspaceId(workspaceId) {
    const channels = await telegramChannelService.getLinkedTelegramChannelsToWorkspace(workspaceId);
    const posts = await this.find({ workspace: workspaceId }).lean();

    return posts.map((post) => ({
      ...post,
      title: channels
        .find(({ id: telegramChannelId }) => telegramChannelId === post.channelId).title,
    }));
  }
}

module.exports = new TelegramPostService(telegramPostModel);
