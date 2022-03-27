const { Schema, model } = require('mongoose');

const postSchema = new Schema({
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
  text: String,
  attachments: Array,
  channelId: Number,
  postTimestamp: Number,
  status: String,
  integration: { type: Schema.Types.ObjectId, ref: 'Integration' },
});

module.exports = model('Post', postSchema);
