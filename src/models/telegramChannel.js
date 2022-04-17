const { Schema, model } = require('mongoose');

const telegramChannelSchema = new Schema({
  integration: { type: Schema.Types.ObjectId, ref: 'Integration', required: true },
  channelId: { type: Number, required: true },
});

module.exports = model('TelegramChannel', telegramChannelSchema);
