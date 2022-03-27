const { Schema, model } = require('mongoose');

const workspaceSchema = new Schema({
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
  integrationType: String,
  integrationData: Object,
});

module.exports = model('Integration', workspaceSchema);
