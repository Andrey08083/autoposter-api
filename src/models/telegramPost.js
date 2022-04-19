const { Schema, model } = require('mongoose');
const dayjs = require('dayjs');

dayjs.extend(require('dayjs/plugin/utc'));

const telegramPostSchema = new Schema({
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  text: { type: String, required: true },
  channelId: { type: Number, required: true },
  postedAt: { type: Number, required: true, default: dayjs.utc().valueOf() },
  status: String, // TODO
  attachments: Array, // TODO
});

module.exports = model('TelegramPost', telegramPostSchema);
