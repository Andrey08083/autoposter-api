/* eslint-disable camelcase */
const TelegramBot = require('node-telegram-bot-api');
const integrationService = require('../services/integrationService');
const telegramChannelService = require('../services/telegramChannelService');
const workspaceService = require('../services/workspaceService');
const { getMatchesFromRegExp } = require('../helpers/regExp');
const { connectTokenRegExp } = require('../constants/regExp');

const bot = new TelegramBot(process.env.TELEGRAM_AUTH_BOT_TOKEN);

bot.onText(/\/connect (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const [userId, workspaceId, integrationId] = getMatchesFromRegExp(connectTokenRegExp, match[1]);

  const integration = await integrationService.findOneById(integrationId);
  const workspace = await workspaceService.findOne({
    _id: workspaceId,
    user: userId,
  });

  if (!integration) {
    return bot.sendMessage(chatId, 'Integration not found');
  }

  if (!workspace) {
    return bot.sendMessage(chatId, 'Workspace not found');
  }

  if (integration?.integrationData?.telegramUserId) {
    return bot.sendMessage(chatId, 'Integration already connected');
  }

  integration.workspace = workspace._id;
  integration.integrationData = { telegramUserId: msg.from.id };
  await integration.save();

  return bot.sendMessage(chatId, 'Integration successfully connected');
});

/**
 * Try to add channel into integrations
 */
bot.on('message', async (msg) => {
  if (msg.text && (msg.text.startsWith('/connect') || msg.text.startsWith('/start'))) {
    return undefined;
  }

  const chatId = msg.chat.id;
  try {
    const { forward_from_chat } = msg;

    if (!forward_from_chat?.id || forward_from_chat?.type !== 'channel') {
      return bot.sendMessage(chatId, 'This message is not forwarded from channel');
    }

    // Check are bot an admin of channel
    await bot.getChatMember(forward_from_chat.id, msg.from.id);

    const integration = await integrationService.findOne({
      'integrationData.telegramUserId': msg.from.id,
    });

    if (!integration) {
      return bot.sendMessage(chatId, 'You are not connected to any workspace');
    }

    // To avoid duplicate channels in one workspace
    const possibleChannel = await telegramChannelService.findOne({
      integration: integration._id,
      channelId: forward_from_chat.id,
    });

    if (possibleChannel) {
      return bot.sendMessage(chatId, 'This channel is already connected to workspace');
    }

    await telegramChannelService.create({
      integration: integration._id,
      channelId: forward_from_chat.id,
    });

    return bot.sendMessage(chatId, `Channel ${forward_from_chat.title} is successfully linked to workspace`);
  } catch (e) {
    if (e.message.includes('bot is not a member of the channel chat')) {
      return bot.sendMessage(chatId, 'Bot (or you) is not a member of this channel');
    }
    return bot.sendMessage(chatId, 'Bot (or you) is not a member of this private channel');
  }
});

module.exports = bot;
