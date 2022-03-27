const { Schema, model } = require('mongoose');

const workspaceSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  integrations: [{ type: Schema.Types.ObjectId, ref: 'Integration' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

module.exports = model('Workspace', workspaceSchema);
